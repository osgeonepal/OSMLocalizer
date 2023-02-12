from backend import db
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import ARRAY
from geoalchemy2 import Geometry
from flask import json

from backend.models.sql.features import Feature
from backend.models.dtos.challenge_dto import ChallengeDTO


class Challenge(db.Model):
    """Describes challenge"""

    __tablename__ = "challenge"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    country = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    to_language = db.Column(db.String, nullable=False)
    
    bbox = db.Column(Geometry("POLYGON", srid=4326), nullable=True)
    centroid = db.Column(Geometry("POINT", srid=4326), nullable=True)
    overpass_query = db.Column(db.String, nullable=True)
    language_tags = db.Column(ARRAY(db.String), nullable=False)
    
    due_date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow() + timedelta(days=30)
    )
    created = db.Column(db.DateTime, default=datetime.utcnow())
    last_updated = db.Column(db.DateTime, default=datetime.utcnow())
    features = db.relationship(
        Feature,
        backref="challenge",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
    )
    translate_engine = db.Column(db.Integer, nullable=True)
    api_key = db.Column(db.String, nullable=True)

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

    def as_dto(self):
        """Convert to dto"""
        challenge_dto = ChallengeDTO(
            id=self.id,
            name=self.name,
            description=self.description,
            due_date=self.due_date,
            status=self.status,
            created=self.created,
            last_updated=self.last_updated,
            centroid=self.centroid,
            language_tags=self.language_tags,
            country=self.country,
        )
        challenge_dto.bbox = json.loads(
            db.engine.execute(self.bbox.ST_AsGeoJSON()).scalar()
        )
        return challenge_dto

    @staticmethod
    def get_by_id(challenge_id: int):
        """Get challenge by id"""
        return Challenge.query.get(challenge_id)

    @staticmethod
    def get_all():
        """Get all challenges"""
        return Challenge.query.all()

    @staticmethod
    def get_all_by_status(status: int):
        """Get all challenges by status"""
        return Challenge.query.filter_by(status=status).all()
