import jwt
from datetime import timedelta
from flask import current_app
from flask_httpauth import HTTPTokenAuth

from backend.models.sql.user import User
from backend.models.dtos.user_dto import UserLoginDTO, UserAllDTO
from backend.services.utills import timestamp
from backend.errors import Unauthorized, NotFound

# Validate jwt token
auth = HTTPTokenAuth(scheme="Bearer")


@auth.verify_token
def verify_token(token):
    if not token:
        return None
    try:
        data = jwt.decode(
            token, current_app.config["APP_SECRET_KEY"], algorithms=["HS256"]
        )
    except Exception:
        raise Unauthorized("INVALID_TOKEN")
    user_id = data.get("user_id")
    return user_id


class UserService:
    @staticmethod
    def get_user_by_id(user_id: int) -> User:
        """Get a user by id."""
        user = User.get_by_id(user_id)
        if user is None:
            raise NotFound("USER_NOT_FOUND")
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
        user = User.get_by_id(osm_user["id"])
        if user is None:
            user = UserService.create_user_from_osm(osm_user)
        # Get user picture_url else set None
        try:
            user.picture_url = osm_user["img"]["href"]
        except KeyError:
            user.picture_url = None
        user.last_login = timestamp()
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
        return jwt.encode(
            {"user_id": user_id, "exp": timestamp() + timedelta(days=7)},
            current_app.config["APP_SECRET_KEY"],
            algorithm="HS256",
        )

    @staticmethod
    def is_user_admin(user_id: int) -> bool:
        """Check if user is admin.
        :param user_id: The id of the user.
        :return: True if user is admin else False.
        """
        user = UserService.get_user_by_id(user_id)
        return user.role == 1

    @staticmethod
    def can_user_validate(user_id: int) -> bool:
        """Check if user is validator.
        :param user_id: The id of the user.
        :return: True if user is validator else False.
        """
        user = UserService.get_user_by_id(user_id)
        return user.role == 2 or user.role == 1

    @staticmethod
    def get_all_users():
        """Get all users."""
        users_list = [user.as_dto() for user in User.get_all()]
        return UserAllDTO(users=users_list).dict()
