from cachetools import cached, TTLCache

from backend.services.user_service import UserService
from backend.models.sql.enum import FeatureStatus
from backend.models.sql.features import Feature
from backend.models.sql.challenge import Challenge
from backend.models.sql.user import User
from backend.models.dtos.stats_dto import UserStatsDTO, ListUserStatsDTO, HomeStatsDTO


class StatsService:
    @staticmethod
    def get_home_page_stats():
        """Get home page stats"""
        total_challenges = Challenge.query.count()
        total_localized = Feature.query.filter_by(
            status=FeatureStatus.LOCALIZED.value
        ).count()
        total_users = User.query.count()
        return HomeStatsDTO(
            total_challenges=total_challenges,
            total_localized=total_localized,
            total_users=total_users,
        )

    @staticmethod
    def get_user_challenegs_count(user_id: int):
        """Get number of hallenges the user has contributed to"""
        return (
            Feature.query.filter_by(localized_by=user_id)
            .distinct(Feature.challenge_id)
            .count()
        )

    @staticmethod
    def get_user_stats_by_status(
        user_id: int, action, challenge_id: int = None, start_date=None, end_date=None
    ):
        """Get user stats by status"""
        if action.upper() == "LOCALIZED":
            query = Feature.query.filter_by(
                status=FeatureStatus.LOCALIZED.value, localized_by=user_id
            )
        elif action.upper() == "SKIPPED":
            query = Feature.query.filter(
                Feature.status.in_(
                    (
                        FeatureStatus.OTHER.value,
                        FeatureStatus.ALREADY_LOCALIZED.value,
                        FeatureStatus.TOO_HARD.value,
                        FeatureStatus.INVALID_DATA.value,
                    )
                )
            ).filter_by(localized_by=user_id)
        else:
            raise Exception("Invalid action")
        if start_date:
            query = query.filter(Feature.last_updated >= start_date)
        if end_date:
            query = query.filter(Feature.last_updated <= end_date)
        if challenge_id:
            query = query.filter_by(challenge_id=challenge_id)
        return query.count()

    @staticmethod
    def get_user_stats(
        user_id: int, challenge_id: int = None, start_date=None, end_date=None
    ):
        """Get user stats"""
        user = UserService.get_user_by_id(user_id)
        total_localized = StatsService.get_user_stats_by_status(
            user_id, "LOCALIZED", challenge_id, start_date, end_date
        )
        total_skipped = StatsService.get_user_stats_by_status(
            user_id, "SKIPPED", challenge_id, start_date, end_date
        )
        # Total challenges is the number of challenges the user has contributed to
        total_challenges = StatsService.get_user_challenegs_count(user_id)
        stats_dto = UserStatsDTO(
            username=user.username,
            picture_url=user.picture_url,
            total_localized=total_localized,
            total_skipped=total_skipped,
        )
        if not challenge_id:
            stats_dto.total_challenges = total_challenges

        return stats_dto

    @staticmethod
    def get_all_challenge_contributors(
        challenge_id: int, start_date=None, end_date=None
    ):
        """Get list of contributors ids for a challenge"""
        query = (
            Feature.query.with_entities(Feature.localized_by)
            .filter_by(challenge_id=challenge_id)
            .filter(Feature.localized_by.isnot(None))
            .distinct(Feature.localized_by)
        )

        if start_date:
            query = query.filter(Feature.last_updated >= start_date)
        if end_date:
            query = query.filter(Feature.last_updated <= end_date)
        contributors = query.all()
        return [contributor[0] for contributor in contributors]

    @staticmethod
    def get_challenge_contributors_count(challenge_id: int):
        """Get number of contributors for a challenge"""
        return (
            Feature.query.filter_by(challenge_id=challenge_id)
            .filter(Feature.localized_by.isnot(None))
            .distinct(Feature.localized_by)
            .count()
        )

    @staticmethod
    def get_challenge_contributors_stats(
        challenge_id: int, start_date=None, end_date=None
    ):
        """Get challenge contributors stats"""

        contributor_ids = StatsService.get_all_challenge_contributors(
            challenge_id, start_date, end_date
        )
        contributors_stats = []
        for contributor_id in contributor_ids:
            contributors_stats.append(
                StatsService.get_user_stats(
                    contributor_id, challenge_id, start_date, end_date
                )
            )
        return ListUserStatsDTO(users=contributors_stats)

    @staticmethod
    @cached(cache=TTLCache(maxsize=1024, ttl=300))  # Cache for 5 minutes
    def get_user_leaderboard():
        """Get user leaderboard"""
        # TODO: Add pagination  and calculate stats using Feature table
        users = (
            Feature.query.with_entities(Feature.localized_by)
            .filter(Feature.localized_by.isnot(None))
            .distinct(Feature.localized_by)
            .all()
        )
        user_stats = []
        for user in users:
            user_stats.append(StatsService.get_user_stats(user[0]))
        return ListUserStatsDTO(users=user_stats)
