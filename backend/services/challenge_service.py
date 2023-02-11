import math
import geojson
from geoalchemy2 import shape
from shapely.geometry import box, Polygon
from werkzeug.exceptions import BadRequest, NotFound


from backend import db
from backend.models.sql.challenge import Challenge
from backend.models.sql.postgis import (
    ST_Transform,
    ST_Area,
)
from backend.models.dtos.challenge_dto import (
    ChallengeDTO,
    ChallengeSummaryDTO,
    ChallengeListDTO,
    CreateChallengeDTO,
    UpdateChallengeDTO,
)

# max area allowed for passed in bbox, calculation shown to help future maintenance
# Total area of challenge to be allowed is 100 sq km. So max area of bbox is 100*100, 2 for square meter
MAX_AREA = math.pow(100 * 100, 2)


class ChallengeService:
    """Service class for Challenge model"""

    @staticmethod
    def create_challenge(challenge_dto: CreateChallengeDTO) -> ChallengeDTO:
        """Create new challenge"""
        bbox = list(map(float, challenge_dto.bbox.split(",")))
        bbox_polygon = ChallengeService.make_polygon_from_bbox(bbox)
        challenge = Challenge(
            name=challenge_dto.name,
            description=challenge_dto.description,
            due_date=challenge_dto.due_date,
            status=challenge_dto.status,
            centroid=challenge_dto.centroid,
            language_tags=challenge_dto.language_tags,
            feature_tags=challenge_dto.feature_tags,
            country=challenge_dto.country,
        )
        challenge.bbox = f"SRID=4326;{bbox_polygon.wkt}"
        challenge.create()
        return challenge.as_dto()

    @staticmethod
    def update_challenge(
        challenge_id: int, challenge_dto: UpdateChallengeDTO
    ) -> ChallengeDTO:
        """Update existing challenge"""
        challenge = Challenge.get_by_id(challenge_id)
        challenge.name = challenge_dto.name
        challenge.description = challenge_dto.description
        challenge.due_date = challenge_dto.due_date
        challenge.status = challenge_dto.status
        challenge.update()
        return ChallengeDTO.from_orm(challenge)

    @staticmethod
    def get_challenge_by_id(challenge_id: int) -> ChallengeDTO:
        """Get challenge by id"""
        challenge = Challenge.get_by_id(challenge_id)
        if not challenge:
            error = NotFound(f"Challenge with id {challenge_id} not found")
            error.data = {"sub_code": "challenge_not_found"}
            raise error
        challenge.bbox = ChallengeService.get_bbox_geometry_as_geojson(challenge.bbox)
        return ChallengeDTO.from_orm(challenge)

    @staticmethod
    def get_all_challenges() -> ChallengeListDTO:
        """Get all challenges"""
        challenges = Challenge.get_all()
        
        return ChallengeListDTO(
            challenges=[ChallengeSummaryDTO.from_orm(challenge) for challenge in challenges]
        )

    @staticmethod
    def get_all_challenges_by_status(status: int) -> ChallengeListDTO:
        """Get all challenges by status"""
        challenges = Challenge.get_all_by_status(status)
        return ChallengeListDTO(
            challenges=[ChallengeDTO.from_orm(challenge) for challenge in challenges]
        )

    @staticmethod
    def delete_challenge(challenge_id: int) -> None:
        """Delete challenge by id"""
        challenge = Challenge.get_by_id(challenge_id)
        challenge.delete()

    @staticmethod
    def get_all_challenges_by_country(country: str) -> ChallengeListDTO:
        """Get all challenges by country"""
        challenges = Challenge.query.filter_by(country=country).all()
        return ChallengeListDTO(
            challenges=[ChallengeDTO.from_orm(challenge) for challenge in challenges]
        )

    # Code taken from hotosm/tasking-manager
    @staticmethod
    def make_polygon_from_bbox(bbox: list, srid: int = 4326) -> Polygon:
        """make a shapely Polygon in SRID 4326 from bbox and srid"""
        try:
            polygon = box(bbox[0], bbox[1], bbox[2], bbox[3])
            geometry = shape.from_shape(polygon, srid)
            geom_4326 = db.engine.execute(ST_Transform(geometry, 4326)).scalar()
            polygon = shape.to_shape(geom_4326)

        except Exception as e:
            error = BadRequest()
            error.data = {
                "message": f"error making polygon: {e}",
                "subcode": "invalid_request",
            }
            raise error

        if not ChallengeService.validate_bbox_area(polygon):
            error = BadRequest()
            error.data = {
                "message": "challenge bbox area exceeds maximum allowed",
                "subcode": "invalid_request",
            }
            raise error
        return polygon

    @staticmethod
    def _get_area_sqm(polygon: Polygon) -> float:
        """get the area of the polygon in square metres"""
        return db.engine.execute(
            ST_Area(ST_Transform(shape.from_shape(polygon, 4326), 3857))
        ).scalar()

    @staticmethod
    def validate_bbox_area(polygon: Polygon) -> bool:
        """check polygon does not exceed maximim allowed area"""
        area = ChallengeService._get_area_sqm(polygon)
        return area <= MAX_AREA

    @staticmethod
    def get_bbox_geometry_as_geojson(bbox):
        """Helper which returns the bbox geometry as a geojson object"""
        if bbox is None:
            return None
        bbox_geojson = db.engine.execute(bbox.ST_AsGeoJSON()).scalar()
        return geojson.loads(bbox_geojson)
