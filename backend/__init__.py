from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from backend.config import EnvironmentConfig

db = SQLAlchemy()

def create_app(config=EnvironmentConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    
    CORS(app)
        
    @app.route("/")
    def system():
        return {"system": "healthy"}, 200

    return app
