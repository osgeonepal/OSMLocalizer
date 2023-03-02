from flask_restx import Resource
from flask import request
from backend.services.feature_service import FeatureService
from backend.services.user_service import auth
from backend.errors import NotFound


class FeaturesAllAPI(Resource):
    def get(self, challenge_id: int):
        return FeatureService.get_all_features_as_geojson(challenge_id)


class FeatureRestAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int, feature_id: int):
        current_user = auth.current_user()
        nearby = request.args.get("nearby")
        FeatureService.reset_expired_tasks(challenge_id)
        try:
            feature = FeatureService.get_feature_to_localize(
                feature_id, challenge_id, current_user, nearby
            )
            return feature
        except NotFound as e:
            e.to_dict()

    @auth.login_required
    def post(self, challenge_id: int):
        current_user = auth.current_user()
        featureIds = request.get_json()["featureIds"]
        status = request.get_json()["status"]
        return FeatureService.update_feature(
            featureIds, challenge_id, status, current_user
        )


class FeaturesRandomAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int):
        nearby = request.args.get("nearby")
        current_user = auth.current_user()
        FeatureService.reset_expired_tasks(challenge_id)
        try:
            feature = FeatureService.get_random_task(challenge_id, current_user, nearby)
            return feature
        except NotFound as e:
            return e.to_dict()
