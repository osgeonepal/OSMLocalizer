from backend.services.user_service import UserService
from backend.models.sql.enum import FeatureStatus
from backend.models.sql.features import Feature
from backend.models.dtos.stats_dto import UserStatsDTO


class StatsService:
    @staticmethod
    def get_user_challenegs_count(user_id: int):
        """Get user challenges count"""
        return (
            Feature.query.filter_by(localized_by=user_id)
            .union(Feature.query.filter_by(validated_by=user_id))
            .union(Feature.query.filter_by(skipped_by=user_id))
            .distinct(Feature.challenge_id)
            .count()
        )

    @staticmethod
    def get_user_stats_by_status(user_id: int, status: int, challenge_id: int = None):
        """Get user stats by status"""
        if status == FeatureStatus.LOCALIZED.value:
            query = Feature.query.filter_by(
                status=FeatureStatus.LOCALIZED.value, localized_by=user_id
            )
        elif status == FeatureStatus.VALIDATED.value:
            query = Feature.query.filter_by(
                status=FeatureStatus.VALIDATED.value, validated_by=user_id
            )
        elif status in [
            FeatureStatus.OTHER.value,
            FeatureStatus.TOO_HARD.value,
            FeatureStatus.INVALID_DATA.value,
            FeatureStatus.ALREADY_LOCALIZED.value,
        ]:
            query = Feature.query.filter_by(status=status, skipped_by=user_id)
        if challenge_id:
            query = query.filter_by(challenge_id=challenge_id)
        return query.count()

    @staticmethod
    def get_user_stats(user_id: int, challenge_id: int = None):
        """Get user stats"""
        user = UserService.get_user_by_id(user_id)
        total_localized = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.LOCALIZED.value, challenge_id
        )
        total_validated = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.VALIDATED.value, challenge_id
        )
        total_skipped = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.OTHER.value, challenge_id
        )
        total_already_localized = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.ALREADY_LOCALIZED.value, challenge_id
        )
        total_too_hard = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.TOO_HARD.value, challenge_id
        )
        total_invalid_data = StatsService.get_user_stats_by_status(
            user_id, FeatureStatus.INVALID_DATA.value, challenge_id
        )
        # Total challenges is the number of challenges the user has validated or localized or skipped
        total_challenges = StatsService.get_user_challenegs_count(user_id)
        return UserStatsDTO(
            username=user.username,
            total_localized=total_localized,
            total_validated=total_validated,
            total_skipped=total_skipped,
            total_already_localized=total_already_localized,
            total_too_hard=total_too_hard,
            total_invalid_data=total_invalid_data,
            total_challenges=total_challenges,
        )
