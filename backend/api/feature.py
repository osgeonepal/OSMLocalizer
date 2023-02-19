from flask_restx import Resource
from flask import request
from backend.services.feature_service import FeatureService

class FeaturesAllAPI(Resource):
    def get(self, challenge_id: int):
        return FeatureService.get_all_features_as_geojson(challenge_id)

class FeatureRestAPI(Resource):
    def get(self, challenge_id: int, feature_id: int):
        nearby = request.args.get('nearby')
        return FeatureService.get_feature_by_id(feature_id, challenge_id, nearby)
    
    def post(self, challenge_id: int, feature_id: int):
        status = request.args.get('status')
        return FeatureService.update_feature(feature_id, challenge_id, status)

    
class FeaturesByRandomAPI(Resource):
    def get(self, challenge_id: int):
        nearby = request.args.get('nearby')
        return FeatureService.get_random_task(challenge_id, nearby)
    