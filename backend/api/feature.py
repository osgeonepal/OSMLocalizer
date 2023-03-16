from flask_restful import Resource
from flask import request
from backend.services.feature_service import FeatureService
from backend.services.user_service import auth


class FeaturesAllAPI(Resource):
    def get(self, challenge_id: int):
        return FeatureService.get_all_features_as_geojson(challenge_id)


class FeatureRestAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int, feature_id: int):
        current_user = auth.current_user()
        FeatureService.reset_expired_tasks(challenge_id)
        feature = FeatureService.get_feature_to_localize(
            feature_id, challenge_id, current_user
        )
        return feature

    @auth.login_required
    def post(self, challenge_id: int):
        current_user = auth.current_user()
        featureIds = request.get_json()["featureIds"]
        status = request.get_json()["status"]
        return FeatureService.update_feature(
            featureIds, challenge_id, status, current_user
        )


class GetFeatureToLocalizeAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int):
        current_user = auth.current_user()
        lastFeature = request.args.get("lastFeature")
        FeatureService.reset_expired_tasks(challenge_id)
        return FeatureService.get_random_task(challenge_id, current_user, lastFeature)
