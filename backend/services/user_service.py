import jwt
from datetime import datetime, timedelta
from flask import current_app
from flask_httpauth import HTTPTokenAuth

from backend.models.sql.user import User
from backend.models.dtos.user_dto import UserLoginDTO


# Validate jwt token
auth = HTTPTokenAuth(scheme="Bearer")


@auth.verify_token
def verify_token(token):
    try:
        data = jwt.decode(
            token, current_app.config["APP_SECRET_KEY"], algorithms=["HS256"]
        )
    except:
        return False
    user_id = data.get("user_id")
    return user_id


class UserService:
    @staticmethod
    def get_user_by_id(user_id: int) -> User:
        """Get a user by id."""
        user = User.get_by_id(user_id)
        if user is None:
            raise Exception("User not found")
        return user

    @staticmethod
    def create_user_from_osm(osm_user: dict) -> User:
        """Create a user from OSM data.
        :param osm_user: The OSM user data.
        :return: A user object.
        """
        user = User()
        user.username = osm_user["display_name"]
        user.id = osm_user["id"]
        user.create()
        return user

    @staticmethod
    def login_user(osm_user, osm_token):
        """Create or update a user in the database."""
        print(osm_token)
        user = User.get_by_id(osm_user["id"])
        if user is None:
            user = UserService.create_user_from_osm(osm_user)
            user.picture_url = osm_user["img"]["href"]
        user.last_login = datetime.utcnow()
        user.update()
        jwt_token = UserService.generate_jwt_token(user.id)
        return UserLoginDTO(
            user=user.as_dto(), jwt_token=jwt_token, osm_token=osm_token
        )

    @staticmethod
    def generate_jwt_token(user_id: int) -> str:
        """Generate a token for a user.
        :param user_id: The id of the user.
        :return: A token string.
        """
        print(current_app.config["APP_SECRET_KEY"])
        return jwt.encode(
            {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=7)},
            current_app.config["APP_SECRET_KEY"],
            algorithm="HS256",
        )
