from flask_restful import Resource
from flask import request
from distutils.util import strtobool

from backend.services.feature_service import FeatureService
from backend.services.overpass_service import Overpass
from backend.services.user_service import UserService, auth
from backend.models.sql.enum import FeatureStatus
from backend.errors import Forbidden


class FeaturesAllAPI(Resource):
    def get(self, challenge_id: int):
        # Reset expired tasks before getting all features
        FeatureService.reset_expired_tasks(challenge_id)
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
        feature_ids = request.get_json()["featureIds"]
        status = request.get_json()["status"]
        status = FeatureStatus[status].value
        return FeatureService.update_feature(
            feature_ids, challenge_id, status, current_user
        )


class GetFeatureToLocalizeAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int):
        current_user = auth.current_user()
        last_feature = request.args.get("lastFeature")
        validation_mode = bool(strtobool(request.args.get("validationMode")))
        if validation_mode and not UserService.can_user_validate(current_user):
            raise Forbidden("NOT_VALIDATOR")

        FeatureService.reset_expired_tasks(challenge_id)
        return FeatureService.get_random_task(
            challenge_id, current_user, last_feature, validation_mode
        )


class GetFeatureCountQueryAPI(Resource):
    def get(self):
        """
        Get the number of features in the overpass query of the challenge
        This is used to display the number of features in the overpass query on while creating a challenge
        """
        overpass_query = request.args.get("overpassQuery")
        return Overpass.get_query_feature_count(overpass_query)
