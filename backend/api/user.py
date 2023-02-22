from flask import request
from flask_restx import Resource

from backend import osm, EnvironmentConfig

class UserAuthorizationUrlAPI(Resource):
    def get(self):
        authorization_url, state = osm.authorization_url(
            EnvironmentConfig.OAUTH2_AUTHORIZATION_BASE_URL
        )
        return {"url": authorization_url, "state": state}

class UserTokenAPI(Resource):
    def get(self):
        authorization_code = request.args.get("code", None)
        redirect_uri = request.args.get("redirect_uri", EnvironmentConfig.OAUTH2_REDIRECT_URI)
        osm.redirect_uri = redirect_uri
        token = osm.fetch_token(
            EnvironmentConfig.OAUTH2_TOKEN_URL,
            client_secret=EnvironmentConfig.OAUTH2_CLIENT_SECRET,
            code=authorization_code,
        )
        user_info = osm.get(EnvironmentConfig.OAUTH2_USER_INFO_URL).json()
        return user_info
