from backend import db
from datetime import timedelta
from sqlalchemy.dialects.postgresql import ARRAY
from geoalchemy2 import Geometry
from flask import json

from backend.models.sql.enum import ChallengeStatus, TranslateEngine, FeatureStatus
from backend.models.sql.features import Feature
from backend.models.dtos.challenge_dto import (
    ChallengeDTO,
    ChallengeSummaryDTO,
    ChallengeStatsDTO,
)
from backend.services.utills import get_last_updated, to_strfdate, timestamp


class Challenge(db.Model):
    """Describes challenge"""

    __tablename__ = "challenge"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    country = db.Column(db.String, nullable=True)
    status = db.Column(db.Integer, nullable=False)
    to_language = db.Column(db.String, nullable=False)

    bbox = db.Column(Geometry("POLYGON", srid=4326), nullable=True)
    centroid = db.Column(Geometry("POINT", srid=4326), nullable=True)
    overpass_query = db.Column(db.String, nullable=True)
    language_tags = db.Column(ARRAY(db.String), nullable=False)

    due_date = db.Column(
        db.DateTime, nullable=False, default=timestamp() + timedelta(days=30)
    )
    created = db.Column(db.DateTime, default=timestamp())
    last_updated = db.Column(db.DateTime, default=timestamp())
    features = db.relationship(
        Feature,
        backref="challenge",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
    )
    translate_engine = db.Column(db.Integer, nullable=True)
    api_key = db.Column(db.String, nullable=True)
    feature_instructions = db.Column(db.String(255), nullable=True)

    created_by = db.Column(
        db.BigInteger, db.ForeignKey("users.id", name="fk_users"), nullable=False
    )

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

    def as_dto(self, stats=False):
        """Convert to dto"""
        challenge_dto = ChallengeDTO(
            id=self.id,
            name=self.name,
            status=ChallengeStatus(self.status).name,
            description=self.description,
            country=self.country,
            to_language=self.to_language,
            due_date=self.due_date,
            created=self.created,
            last_updated=self.last_updated,
            language_tags=", ".join(self.language_tags),
            translate_engine=TranslateEngine(self.translate_engine).name
            if self.translate_engine
            else None,
            feature_instructions=self.feature_instructions,
        )
        challenge_dto.bbox = json.loads(
            db.engine.execute(self.bbox.ST_AsGeoJSON()).scalar()
        )
        challenge_dto.centroid = json.loads(
            db.engine.execute(self.centroid.ST_AsGeoJSON()).scalar()
        )
        if stats:
            challenge_dto.stats = self.get_challenge_progress()
        return challenge_dto

    def as_dto_for_summary(self, stats):
        challenge_dto = ChallengeSummaryDTO(
            id=self.id,
            name=self.name,
            status=self.status,
            description=self.description,
            country=self.country,
            to_language=self.to_language,
            due_date=(self.due_date - timestamp()).days,
            last_updated=get_last_updated(self.last_updated),
            created=to_strfdate(self.created),
        )
        challenge_dto.centroid = json.loads(
            db.engine.execute(self.centroid.ST_AsGeoJSON()).scalar()
        )
        challenge_dto.bbox = json.loads(
            db.engine.execute(self.bbox.ST_AsGeoJSON()).scalar()
        )
        if stats:
            challenge_dto.stats = self.get_challenge_progress()
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

    def get_challenge_progress(self):
        """Get challenge progress"""
        challenge_stats_dto = ChallengeStatsDTO(
            total=self.features.count(),
            localized=self.features.filter_by(
                status=FeatureStatus.LOCALIZED.value
            ).count(),
            skipped=self.features.filter_by(status=FeatureStatus.OTHER.value).count(),
            already_localized=self.features.filter_by(
                status=FeatureStatus.ALREADY_LOCALIZED.value
            ).count(),
            validated=self.features.filter_by(
                status=FeatureStatus.VALIDATED.value
            ).count(),
            too_hard=self.features.filter_by(
                status=FeatureStatus.TOO_HARD.value
            ).count(),
            invalid_data=self.features.filter_by(
                status=FeatureStatus.INVALID_DATA.value
            ).count(),
            to_localize=self.features.filter_by(
                status=FeatureStatus.TO_LOCALIZE.value
            ).count(),
        )

        return challenge_stats_dto
