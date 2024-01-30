from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api
from requests_oauthlib import OAuth2Session
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

from backend.config import EnvironmentConfig

db = SQLAlchemy()
osm = OAuth2Session(
    client_id=EnvironmentConfig.OAUTH2_CLIENT_ID,
    scope=EnvironmentConfig.OAUTH2_SCOPE,
    redirect_uri=EnvironmentConfig.OAUTH2_REDIRECT_URI,
)


def create_app(config=EnvironmentConfig):
    if config.SENTRY_BACKEND_DSN:
        sentry_sdk.init(
            dsn=EnvironmentConfig.SENTRY_BACKEND_DSN,
            environment=EnvironmentConfig.SENTRY_ENVIRONMENT,
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0,
            _experiments={
                "profiles_sample_rate": 1.0,
            },
        )

    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    api = Api(app, prefix="/api")
    CORS(app)

    @app.route("/api/system/")
    def system():
        return {"system": "healthy"}, 200

    from backend.api.challenge import Challenge, ChallengeList
    from backend.api.feature import (
        FeatureRestAPI,
        FeaturesAllAPI,
        GetFeatureToLocalizeAPI,
        GetFeatureCountQueryAPI,
    )
    from backend.api.user import (
        UserAuthorizationUrlAPI,
        UserTokenAPI,
        UserAllAPI,
        UserTokenExpiryAPI,
        UserRoleApi,
    )
    from backend.api.translate import TranslateTextAPI
    from backend.api.statistics import (
        UserStatSAPI,
        ChallengeContributorsStatsAPI,
        HomeStatsAPI,
        UserLeaderboardAPI,
    )

    api.add_resource(HomeStatsAPI, "/stats/home/")
    api.add_resource(
        Challenge,
        "/challenge/",
        endpoint="create_challenge",
        methods=["POST"],
    )
    api.add_resource(
        Challenge, "/challenge/<int:challenge_id>/", methods=["GET", "PATCH", "DELETE"]
    )
    api.add_resource(ChallengeList, "/challenges/")
    api.add_resource(FeaturesAllAPI, "/challenge/<int:challenge_id>/features/")
    api.add_resource(
        FeatureRestAPI,
        "/challenge/<int:challenge_id>/feature/<int:feature_id>/",
        methods=["GET"],
    )
    api.add_resource(
        FeatureRestAPI,
        "/challenge/<int:challenge_id>/feature/",
        methods=["POST"],
        endpoint="create_feature",
    )
    api.add_resource(
        GetFeatureToLocalizeAPI,
        "/challenge/<int:challenge_id>/feature/get-feature-to-localize/",
    )
    api.add_resource(
        GetFeatureCountQueryAPI,
        "/challenge/get-feature-count-query/",
    )

    api.add_resource(UserAuthorizationUrlAPI, "/auth/url/")
    api.add_resource(UserTokenAPI, "/auth/token/")
    api.add_resource(UserTokenExpiryAPI, "/auth/token-expiry/")

    api.add_resource(UserAllAPI, "/users/")
    api.add_resource(UserRoleApi, "/user/<int:user_id>/update/role/<int:role>/")
    api.add_resource(UserStatSAPI, "/user/<int:user_id>/stats/")
    api.add_resource(
        ChallengeContributorsStatsAPI, "/challenge/<int:challenge_id>/user-stats/"
    )
    api.add_resource(UserLeaderboardAPI, "/user/leaderboard/")

    api.add_resource(TranslateTextAPI, "/challenge/<int:challenge_id>/translate/")

    return app
