from backend import db
from datetime import datetime


class Feature(db.Model):
    """Describes feature"""

    __tablename__ = "feature"
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(
        db.Integer, db.ForeignKey("challenge.id"), index=True, primary_key=True
    )
    element_type = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Integer, nullable=False)

    def create(self):
        """Create new entry"""
        db.session.add(self)
        db.session.commit()

    def update(self):
        """Save changes to db"""
        db.session.commit()

    def delete(self):
        """Delete entry from db"""
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_by_id(feature_id: int, challenge_id: int):
        """Get feature by id""" ""
        return Feature.query.get(feature_id, challenge_id)

    @staticmethod
    def get_all_challenge_features(challenge_id: int):
        """Get all features for a challenge"""
        return Feature.query.filter_by(challenge_id=challenge_id).all()

    @staticmethod
    def get_features_by_status(challenge_id: int, status: int):
        """Get all features for a challenge by status"""
        return Feature.query.filter_by(challenge_id=challenge_id, status=status).all()
