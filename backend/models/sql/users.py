from backend import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.Integer, nullable=False)
    level = db.Column(db.Integer, nullable=False)
    
    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_id(id):
        return User.query.filter_by(id=id).first()
    
    def as_dto(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'level': self.level
        }
