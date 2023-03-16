import datetime

from backend.services.utills import timestamp, parse_duration
from backend.errors import NotFound
from backend.models.sql.features import Feature
from backend.services.challenge_service import ChallengeService
from backend.models.sql.enum import FeatureStatus


class FeatureService:
    """Contains all services related to features"""

    @staticmethod
    def get_by_id(feature_id: int, challenge_id: int) -> Feature:
        """Get a feature by id"""
        return Feature.get_by_id(feature_id, challenge_id)

    @staticmethod
    def get_all_features(challenge_id: int):
        """Get all features for a challenge"""
        return Feature.query.filter_by(challenge_id=challenge_id).all()

    @staticmethod
    def get_features_by_status(challenge_id: int, status: int):
        """Get all features for a challenge by status"""
        return Feature.query.filter_by(challenge_id=challenge_id, status=status).all()

    @staticmethod
    def get_all_features_as_geojson(challenge_id: int):
        """Get all features for a challenge as a feature collection"""
        features = Feature.query.filter_by(challenge_id=challenge_id).all()
        return {
            "type": "FeatureCollection",
            "features": [feature.as_geojson() for feature in features],
        }

    @staticmethod
    def get_features_by_status_as_geojson(challenge_id: int, status: int):
        """Get all features for a challenge by status as a feature collection"""
        features = FeatureService.get_features_by_status(challenge_id, status)
        return {
            "type": "FeatureCollection",
            "features": [feature.as_geojson() for feature in features],
        }

    @staticmethod
    def get_feature_to_localize(
        feature_id: int, challenge_id, user_id: int, lastFeature: int = None
    ):
        """Get a feature by id"""
        feature = FeatureService.get_by_id(feature_id, challenge_id)
        if feature.status != FeatureStatus.TO_LOCALIZE.value:
            feature = Feature.get_random_task(challenge_id)
        feature.lock_to_localize(user_id)
        return {"feature": feature.as_geojson()}

    @staticmethod
    def get_random_task(challenge_id: int, user_id, lastFeature: int = None):
        """Get a random task"""
        if lastFeature:
            feature = Feature.get_nearby(lastFeature, challenge_id)
        else:
            feature = Feature.get_random_task(challenge_id)
        if not feature:
            raise NotFound("NO_FEATURES_TO_LOCALIZE")
        feature.lock_to_localize(user_id)
        return {"feature": feature.as_geojson()}

    @staticmethod
    def update_feature(feature_ids: list, challenge_id: int, status: int, user_id: int):
        """Update the status of a feature"""
        features = Feature.query.filter(
            Feature.id.in_(feature_ids), Feature.challenge_id == challenge_id
        ).all()
        for feature in features:
            if feature.status in [
                FeatureStatus.TO_LOCALIZE.value,
                FeatureStatus.LOCKED_TO_LOCALIZE.value,
                FeatureStatus.LOCKED_TO_VALIDATE.value,
            ]:
                feature.status = FeatureStatus[status].value
                feature.last_updated = timestamp()
            if status == "LOCALIZED":
                feature.localized_by = user_id
            if status == "VALIDATED":
                feature.validated_by = user_id
            feature.locked_by = None
            feature.update()
        challenge = ChallengeService.get_challenge_by_id(challenge_id)
        challenge.last_updated = timestamp()
        return {"status": "success"}

    @staticmethod
    def auto_unlock_delta():
        return parse_duration("30m")

    @staticmethod
    def reset_expired_tasks(challenge_id: int):
        """Reset tasks that have been changed but not uploaded for more than 30 minutes"""
        expiry_delta = FeatureService.auto_unlock_delta()
        expiry_date = datetime.datetime.utcnow() - expiry_delta
        features = Feature.query.filter(
            Feature.challenge_id == challenge_id,
            Feature.status.in_(
                (
                    FeatureStatus.LOCKED_TO_LOCALIZE.value,
                    FeatureStatus.LOCKED_TO_VALIDATE.value,
                )
            ),
            Feature.last_updated <= expiry_date,
        ).all()
        for feature in features:
            if feature.status == FeatureStatus.LOCKED_TO_LOCALIZE.value:
                feature.status = FeatureStatus.TO_LOCALIZE.value
            if feature.status == FeatureStatus.LOCKED_TO_VALIDATE.value:
                feature.status = FeatureStatus.LOCALIZED.value
            feature.locked_by = None
            feature.last_updated = timestamp()
            feature.update()
