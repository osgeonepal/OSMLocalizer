from backend import db
from geoalchemy2 import Geometry
import json

from backend.models.sql.enum import FeatureStatus
from backend.services.utills import timestamp, to_strftime
from backend.errors import NotFound


class Feature(db.Model):
    """Describes feature"""

    __tablename__ = "feature"
    id = db.Column(db.BigInteger, primary_key=True)
    challenge_id = db.Column(
        db.Integer, db.ForeignKey("challenge.id"), index=True, primary_key=True
    )
    osm_type = db.Column(db.String, nullable=False)
    geometry = db.Column(Geometry("POINT", srid=4326), nullable=True)
    status = db.Column(
        db.Integer, nullable=False, default=FeatureStatus.TO_LOCALIZE.value
    )
    last_updated = db.Column(db.DateTime, default=timestamp)
    localized_by = db.Column(
        db.BigInteger,
        db.ForeignKey("users.id", name="fk_users_localizer"),
        index=True,
        default=None,
        nullable=True,
    )
    validated_by = db.Column(
        db.BigInteger,
        db.ForeignKey("users.id", name="fk_users_validator"),
        index=True,
        default=None,
        nullable=True,
    )
    locked_by = db.Column(
        db.BigInteger,
        db.ForeignKey("users.id", name="fk_users_locker"),
        index=True,
        default=None,
        nullable=True,
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

    def as_geojson(self):
        """Convert to geojson"""
        return {
            "type": "Feature",
            "properties": {
                "id": self.id,
                "osm_type": self.osm_type,
                "challenge_id": self.challenge_id,
                "status": self.status,
                "localized_by": self.localized_by,
                "validated_by": self.validated_by,
                "last_updated": to_strftime(self.last_updated),
            },
            "geometry": json.loads(
                db.engine.execute(self.geometry.ST_AsGeoJSON()).scalar()
            ),
        }

    def lock_to_localize(self, user_id: int):
        """Lock feature to localize"""
        self.status = FeatureStatus.LOCKED_TO_LOCALIZE.value
        self.locked_by = user_id
        self.last_updated = timestamp()
        self.update()

    def lock_to_validate(self, user_id: int):
        """Lock feature to validate"""
        self.status = FeatureStatus.LOCKED_TO_VALIDATE.value
        self.locked_by = user_id
        self.update()

    @staticmethod
    def get_by_id(feature_id: int, challenge_id: int):
        """Get feature by id""" ""
        feature = Feature.query.filter_by(
            id=feature_id, challenge_id=challenge_id
        ).one_or_none()
        if feature is None:
            raise NotFound("FEATURE_NOT_FOUND")
        return feature

    @staticmethod
    def create_from_dto(feature_dto: dict):
        """Create feature from dto"""
        feature = Feature()
        feature.osm_type = feature_dto["osm_type"]
        feature.status = feature_dto["status"]
        feature.challenge_id = feature_dto["challenge_id"]
        feature.geometry = feature_dto["geometry"]
        return feature

    @staticmethod
    def get_random_task(challenge_id: int):
        """Get random task"""
        return (
            Feature.query.filter_by(challenge_id=challenge_id)
            .filter_by(status=FeatureStatus.TO_LOCALIZE.value)
            .order_by(db.func.random())
            .first()
        )

    @staticmethod
    def get_nearby(feature_id, challenge_id):
        """Get nearby features"""
        feature_geom = Feature.get_by_id(feature_id, challenge_id).geometry
        nearby = db.engine.execute(
            f"""
            SELECT id, geometry <-> ('{feature_geom}') AS distance
            FROM feature
            WHERE challenge_id = {challenge_id}
            AND status = {FeatureStatus.TO_LOCALIZE.value}
            AND id != {feature_id}
            ORDER BY distance
            LIMIT 1;
        """
        ).fetchall()
        if nearby:
            feature = Feature.get_by_id(nearby[0][0], challenge_id)
        else:
            raise NotFound("NO_FEATURES_TO_LOCALIZE")
        return feature
