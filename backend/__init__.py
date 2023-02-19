from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restx import Api

from backend.config import EnvironmentConfig

db = SQLAlchemy()


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

    api.add_resource(Challenge, "/challenge/", "/challenge/<int:challenge_id>/")
    api.add_resource(ChallengeList, "/challenges/")
    api.add_resource(FeaturesAllAPI, "/challenge/<int:challenge_id>/features/")
    api.add_resource(
        FeatureRestAPI, "/challenge/<int:challenge_id>/feature/<int:feature_id>/", methods=["GET"]
    )
    api.add_resource(
        FeatureRestAPI,
        "/challenge/<int:challenge_id>/feature/", methods=["POST"]
    )
    api.add_resource(
        FeaturesRandomAPI, "/challenge/<int:challenge_id>/features/random/"
    )

    return app
