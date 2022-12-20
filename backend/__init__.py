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
    
    from backend.models.translate import Translate, TranslateDTO
    @app.route("/translate", methods=["GET", "POST"])
    def translate():
        text = Translate.get_to_translate_text()
        return TranslateDTO.from_orm(text).dict()
    

    return app
