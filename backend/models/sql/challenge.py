from backend import db
from datetime import timedelta
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func, and_, or_
from geoalchemy2 import Geometry
from flask import json

from backend.models.sql.enum import ChallengeStatus, TranslateEngine, FeatureStatus
from backend.models.sql.features import Feature, User
from backend.models.dtos.challenge_dto import (
    ChallengeDTO,
    ChallengeSummaryDTO,
    ChallengeStatsDTO,
    SearchChallengeDTO,
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
    feature_instructions = db.Column(db.String, nullable=True)

    private = db.Column(
        db.Boolean, default=False, nullable=False
    )

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
            created=to_strfdate(self.created),
            last_updated=get_last_updated(self.last_updated),
            language_tags=", ".join(self.language_tags),
            translate_engine=TranslateEngine(self.translate_engine).name
            if self.translate_engine
            else None,
            feature_instructions=self.feature_instructions,
            private=self.private
        )
        challenge_dto.author = User.get_by_id(self.created_by).username
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
            private=self.private
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
    def get_all_challenges(dto: SearchChallengeDTO, current_user):
        """Get all challenges by status"""
        query = Challenge.query
        if dto.status is not None:
            query = query.filter_by(status=dto.status)
        if dto.country:
            query = query.filter_by(country=dto.country)
        if dto.name:
            query = query.filter(
                func.lower(Challenge.name).ilike(f"%{dto.name.lower()}%")
            )
        if dto.to_language and dto.to_language != "ALL":
            query = query.filter_by(to_language=dto.to_language)
        if dto.created_by:
            query = query.filter_by(created_by=dto.created_by)
        
        if current_user:
            query = query.filter(or_(Challenge.private==False, and_(Challenge.private==True, Challenge.created_by==current_user)))
        else:
            query = query.filter(Challenge.private==False)

        if dto.sort_by == "NEWEST":
            query = query.order_by(Challenge.id.desc())
        elif dto.sort_by == "OLDEST":
            query = query.order_by(Challenge.id.asc())

        paginated_results = query.paginate(
            page=dto.page, per_page=dto.per_page, error_out=False
        )
        return paginated_results

    def calculalate_status_count(self, status):
        """
        Calculate status count
        -----------
        For example, if a feature is localized and validated, it should be counted as localized.
        As we have a status and last_status, we need to check both. So we use combination of and_ and or_
        operators to say Count the feature as localized if:
        1. status is VALIDATED and last_status is LOCALIZED
        2. status is LOCALIZED

        Parameters:
        -----------
        status: FeatureStatus
            status to calculate count for

        Returns:
        -----------
        count: int
            count of features with given status
        """
        count = self.features.filter(
            or_(
                and_(
                    Feature.status == FeatureStatus.VALIDATED.value,
                    Feature.last_status == status.value,
                ),
                Feature.status == status.value,
            )
        ).count()
        return count

    def get_challenge_progress(self):
        """Get challenge progress"""
        challenge_stats_dto = ChallengeStatsDTO(
            total=self.features.count(),
            localized=self.calculalate_status_count(FeatureStatus.LOCALIZED),
            skipped=self.calculalate_status_count(FeatureStatus.OTHER),
            already_localized=self.calculalate_status_count(
                FeatureStatus.ALREADY_LOCALIZED
            ),
            validated=self.features.filter(
                Feature.status == FeatureStatus.VALIDATED.value
            ).count(),
            too_hard=self.calculalate_status_count(FeatureStatus.TOO_HARD),
            invalid_data=self.calculalate_status_count(FeatureStatus.INVALID_DATA),
            to_localize=self.features.filter(
                Feature.status.in_(
                    [FeatureStatus.TO_LOCALIZE.value, FeatureStatus.INVALIDATED.value]
                )
            ).count(),
        )

        return challenge_stats_dto
