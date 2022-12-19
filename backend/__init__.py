from flask import Flask
from flask_cors import CORS


def create_app(g):
    app = Flask(__name__)
    
    CORS(app)
        
    @app.route("/")
    def system():
        return {"system": "healthy"}, 200

    return app
