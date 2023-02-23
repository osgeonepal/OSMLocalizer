from backend import db
from backend.services.utills import timestamp, to_strftime
from backend.models.dtos.user_dto import UserDTO


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    role = db.Column(db.Integer, nullable=False, default=0)
    level = db.Column(db.Integer, nullable=False, default=0)
    date_registered = db.Column(db.DateTime, nullable=False, default=timestamp)
    last_login = db.Column(db.DateTime, nullable=False, default=timestamp)
    picture_url = db.Column(db.String, nullable=True)

    def create(self):
        """Create a new user in the database."""
        db.session.add(self)
        db.session.commit()
        return self

    def update(self):
        """Update a user in the database."""
        db.session.commit()

    @staticmethod
    def get_by_username(username):
        """Get a user by username.
        :param username: The username of the user.
        :return: A user object.
        """
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_id(id):
        """Get a user by id.
        :param id: The id of the user.
        :return: A user object.
        """
        return User.query.filter_by(id=id).first()

    def as_dto(self):
        """Return the user as a dictionary object."""
        return UserDTO(
            id=self.id,
            username=self.username,
            role=self.role,
            level=self.level,
            date_registered=to_strftime(self.date_registered),
            picture_url=self.picture_url,
        )
