from backend.models.sql.features import Feature


class FeatureService():
    """Contains all services related to features"""

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
        features =FeatureService.get_features_by_status(challenge_id, status)
        return {
            "type": "FeatureCollection",
            "features": [feature.as_geojson() for feature in features],
        }
    