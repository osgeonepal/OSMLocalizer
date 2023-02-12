from flask_restx import Resource

from backend.services.feature_service import FeatureService

class FeatureRestAPI(Resource):
    def get(self, challenge_id: int):
        return FeatureService.get_all_features_as_geojson(challenge_id)
