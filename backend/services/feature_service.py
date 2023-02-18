from backend.models.sql.features import Feature
from backend.models.dtos.feature_dto import NearbyFeatureDTO


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
    def get_feature_by_id(feature_id: int, challenge_id, nearby: bool = False):
        """Get a feature by id"""

        feature = FeatureService.get_by_id(feature_id, challenge_id)
        if nearby:
            nearby_feature = Feature.get_nearby(feature.id, feature.challenge_id)
        return {"feature": feature.as_geojson(), "nearby": nearby_feature}

    @staticmethod
    def get_random_task(challenge_id: int, nearby: bool = False):
        """Get a random task"""
        feature = Feature.get_random_task(challenge_id)
        if nearby:
            nearby_feature = Feature.get_nearby(feature.id, feature.challenge_id) 
        return {"feature": feature.as_geojson(), "nearby": nearby_feature if nearby else None}


    # @staticmethod
    # def get_nearby_features(feature_id: int, challenge_id: int):
    #     """Get nearby features for a feature"""
    #     feature = FeatureService.get_feature_by_id(feature_id, challenge_id)
    #     Feature.query.filter_by(challenge_id=challenge_id)
