from flask import request
from flask_restful import Resource

from backend import osm, EnvironmentConfig
from backend.services.user_service import UserService
from backend.errors import NotFound, Unauthorized, BadRequest
from backend.services.user_service import auth
from backend.models.sql.enum import UserRoles


class UserAuthorizationUrlAPI(Resource):
    def get(self):
        authorization_url, state = osm.authorization_url(
            EnvironmentConfig.OAUTH2_AUTHORIZATION_BASE_URL
        )
        return {"url": authorization_url, "state": state}


class UserTokenAPI(Resource):
    def get(self):
        authorization_code = request.args.get("code", None)
        redirect_uri = request.args.get(
            "redirect_uri", EnvironmentConfig.OAUTH2_REDIRECT_URI
        )
        osm.redirect_uri = redirect_uri
        token = osm.fetch_token(
            EnvironmentConfig.OAUTH2_TOKEN_URL,
            client_secret=EnvironmentConfig.OAUTH2_CLIENT_SECRET,
            code=authorization_code,
        )
        user_info = osm.get(EnvironmentConfig.OAUTH2_USER_INFO_URL).json()

        if user_info is None:
            raise NotFound("USER_NOT_FOUND")
        return UserService.login_user(user_info["user"], token["access_token"]).dict()


class UserInfoAPI(Resource):
    @auth.login_required
    def get(self, username):
        user = UserService.get_user_by_username(username)
        if user is None:
            raise NotFound("USER_NOT_FOUND")
        return user.as_dto().dict()


class UserTokenExpiryAPI(Resource):
    @auth.login_required
    def get(self):
        return {"expired": False}, 200


class UserAllAPI(Resource):
    @auth.login_required
    def get(self):
        current_user = auth.current_user()
        if not UserService.is_user_admin(current_user):
            raise Unauthorized("USER_NOT_ADMIN")
        return UserService.get_all_users()


class UserRoleApi(Resource):
    @auth.login_required
    def post(self, user_id, role):
        current_user = auth.current_user()
        if not UserService.is_user_admin(current_user):
            raise Unauthorized("USER_NOT_ADMIN")
        if role not in [UserRoles.ADMIN.value, UserRoles.Mapper.value]:
            raise BadRequest(
                message="User role should be specified and can be one of ADMIN, MAPPER or VALIDATOR."
            )

        user = UserService.get_user_by_id(user_id)
        user.role = role
        user.update()
        return {"message": "User role successfully updated"}
