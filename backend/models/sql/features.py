from backend import db
from datetime import datetime
from geoalchemy2 import Geometry
import json

from backend.models.sql.enum import FeatureStatus

class Feature(db.Model):
    """Describes feature"""

    __tablename__ = "feature"
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(
        db.Integer, db.ForeignKey("challenge.id"), index=True, primary_key=True
    )
    osm_type = db.Column(db.String, nullable=False)
    osm_id = db.Column(db.BigInteger, nullable=False)
    geometry = db.Column(Geometry("POINT", srid=4326), nullable=True)
    status = db.Column(db.Integer, nullable=False, default=FeatureStatus.TO_LOCALIZE.value)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow())
    changeset_id = db.Column(db.Integer, nullable=True)
    localized_by = db.Column(db.String, nullable=True)
    validated_by = db.Column(db.String, nullable=True)
    
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
                "osm_id": self.osm_id,
                "status": self.status,
                "changeset_id": self.changeset_id,
                "localized_by": self.localized_by,
                "validated_by": self.validated_by,
                "last_updated": self.last_updated.strftime("%Y-%m-%d %H:%M:%S"),
            },
            "geometry": json.loads(
            db.engine.execute(self.geometry.ST_AsGeoJSON()).scalar()
        ),
        }

    @staticmethod
    def get_by_id(feature_id: int, challenge_id: int):
        """Get feature by id""" ""
        return Feature.query.filter_by(
            id = feature_id, 
            challenge_id=challenge_id).one_or_none()

    @staticmethod
    def create_from_dto(feature_dto: dict):
        """Create feature from dto"""
        feature = Feature()
        feature.osm_id = feature_dto["osm_id"]
        feature.osm_type = feature_dto["osm_type"]
        feature.status = feature_dto["status"]
        feature.challenge_id = feature_dto["challenge_id"]
        feature.geometry = feature_dto["geometry"]
        return feature

    @staticmethod
    def get_random_task(challenge_id: int):
        """Get random task"""
        return (Feature.query.filter_by(challenge_id=challenge_id)
            .filter_by(status=FeatureStatus.TO_LOCALIZE.value)
            .order_by(db.func.random())
            .first())

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
        return{"id": nearby[0][0], "distance": nearby[0][1]} if nearby else None

