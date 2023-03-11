from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api
from requests_oauthlib import OAuth2Session

from backend.config import EnvironmentConfig

db = SQLAlchemy()
osm = OAuth2Session(
    client_id=EnvironmentConfig.OAUTH2_CLIENT_ID,
    scope=EnvironmentConfig.OAUTH2_SCOPE,
    redirect_uri=EnvironmentConfig.OAUTH2_REDIRECT_URI,
)


def create_app(config=EnvironmentConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    api = Api(app)
    CORS(app)

    @app.route("/")
    def system():
        return {"system": "healthy"}, 200

    from backend.api.challenge import Challenge, ChallengeList
    from backend.api.feature import FeatureRestAPI, FeaturesAllAPI, FeaturesRandomAPI
    from backend.api.user import UserAuthorizationUrlAPI, UserTokenAPI
    from backend.api.translate import TranslateTextAPI

    api.add_resource(Challenge, "/challenge/", "/challenge/<int:challenge_id>/")
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
        FeaturesRandomAPI, "/challenge/<int:challenge_id>/features/random/"
    )
    api.add_resource(UserAuthorizationUrlAPI, "/auth/url/")
    api.add_resource(UserTokenAPI, "/auth/token/")

    api.add_resource(TranslateTextAPI, "/challenge/<int:challenge_id>/translate/")

    return app
