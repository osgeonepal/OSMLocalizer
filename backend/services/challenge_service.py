import math
import geojson
import requests
from backend.config import EnvironmentConfig
from geoalchemy2 import shape
from shapely.geometry import box, Polygon, Point
from backend.errors import BadRequest, NotFound, Forbidden

from backend import db
from backend.models.sql.enum import ChallengeStatus, TranslateEngine
from backend.models.sql.challenge import Challenge
from backend.models.sql.postgis import (
    ST_Transform,
    ST_Area,
)
from backend.models.dtos.challenge_dto import (
    ChallengeDTO,
    ChallengeListDTO,
    CreateChallengeDTO,
    UpdateChallengeDTO,
    SearchChallengeDTO,
    PaginationDTO,
)
from backend.services.overpass_service import Overpass
from backend.services.stats_service import StatsService
from backend.services.user_service import UserService

# max area allowed for passed in bbox, calculation shown to help future maintenance
# Total area of challenge to be allowed is 200 sq km. So max area of bbox is 100*100, 2 for square meter
MAX_AREA = math.pow(100 * int(EnvironmentConfig.MAX_CHALLENGE_AREA), 2)
OSM_NOMINATIM_SERVER_URL = "https://nominatim.openstreetmap.org"


class ChallengeService:
    """Service class for Challenge model"""

    @staticmethod
    def create_challenge(challenge_dto: CreateChallengeDTO) -> ChallengeDTO:
        """Create new challenge"""
        bbox = challenge_dto.bbox
        # Reverse bbox to str
        bbox_str = f"{bbox[1]}, {bbox[0]}, {bbox[3]}, {bbox[2]}"
        bbox_polygon, centroid = ChallengeService.make_polygon_from_bbox(
            challenge_dto.bbox
        )
        country = ChallengeService.get_country_from_coordinates(centroid.y, centroid.x)
        overpass_query = challenge_dto.overpass_query.replace("{{bbox}}", f"{bbox_str}")
        language_tags = [tag.strip() for tag in challenge_dto.language_tags.split(",")]
        challenge = Challenge(
            name=challenge_dto.name,
            description=challenge_dto.description,
            feature_instructions=challenge_dto.feature_instructions,
            country=country,
            status=ChallengeStatus[challenge_dto.status.upper()].value,
            to_language=challenge_dto.to_language,
            bbox=f"SRID=4326;{bbox_polygon.wkt}",
            centroid=f"SRID=4326;{centroid.wkt}",
            overpass_query=overpass_query,
            language_tags=language_tags,
            due_date=challenge_dto.due_date,
            created_by=challenge_dto.created_by,
            private=challenge_dto.private,
        )
        if challenge_dto.translate_engine:
            challenge.translate_engine = (
                TranslateEngine[challenge_dto.translate_engine.upper()].value,
            )
            challenge.api_key = (challenge_dto.api_key,)
        ChallengeService.get_features_from_overpass(challenge, overpass_query)
        challenge.create()
        return True

    @staticmethod
    def update_challenge(
        challenge_id: int, challenge_dto: UpdateChallengeDTO
    ) -> ChallengeDTO:
        """Update existing challenge"""
        challenge = ChallengeService.get_challenge_by_id(challenge_id)
        language_tags = [tag.strip() for tag in challenge_dto.language_tags.split(",")]
        challenge.name = challenge_dto.name
        challenge.description = challenge_dto.description
        challenge.status = ChallengeStatus[challenge_dto.status].value
        challenge.to_language = challenge_dto.to_language
        challenge.feature_instructions = challenge_dto.feature_instructions
        challenge.language_tags = language_tags
        challenge.private = challenge_dto.private
        if challenge_dto.due_date:
            challenge.due_date = challenge_dto.due_date
        if challenge_dto.translate_engine:
            challenge.translate_engine = (
                TranslateEngine[challenge_dto.translate_engine.upper()].value,
            )
            challenge.api_key = challenge_dto.api_key
        challenge.update()
        return True

    @staticmethod
    def get_challenge_by_id(challenge_id) -> Challenge:
        challenge = Challenge.get_by_id(challenge_id)
        if not challenge:
            raise NotFound("CHALLENGE_NOT_FOUND")
        return challenge

    @staticmethod
    def get_challenge_as_dto(challenge_id: int, user_id: int) -> ChallengeDTO:
        """Get challenge by id"""
        challenge = ChallengeService.get_challenge_by_id(challenge_id)
        if ChallengeService.can_user_view_challenge(challenge_id, user_id):
            return challenge.as_dto(stats=True)
        else:
            raise Forbidden("PRIVATE_PROJECT")

    @staticmethod
    def get_all_challenges(dto: SearchChallengeDTO, current_user) -> ChallengeListDTO:
        """Get all challenges"""
        challenges = Challenge.get_all_challenges(dto, current_user)

        challenges_dto = []
        for challenge in challenges.items:
            challenge_dto = challenge.as_dto_for_summary(stats=True)
            challenge_dto.total_contributors = (
                StatsService.get_challenge_contributors_count(challenge.id)
            )
            challenges_dto.append(challenge_dto)
        pagination = PaginationDTO(challenges)
        return ChallengeListDTO(challenges=challenges_dto, pagination=pagination)

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
    def make_polygon_from_bbox(bbox: list, srid: int = 4326) -> tuple((Polygon, Point)):
        """make a shapely Polygon in SRID 4326 from bbox and srid"""
        try:
            polygon = box(bbox[0], bbox[1], bbox[2], bbox[3])
            geometry = shape.from_shape(polygon, srid)
            geom_4326 = db.engine.execute(ST_Transform(geometry, 4326)).scalar()
            polygon = shape.to_shape(geom_4326)
            # Get centroid of polygon
            centroid = polygon.centroid
        except Exception as e:
            raise BadRequest(message=f"error making polygon: {e}")

        if not ChallengeService.validate_bbox_area(polygon):
            raise BadRequest(message="Challenge bbox area exceeds maximum allowed")
        return polygon, centroid

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

    @staticmethod
    def get_country_from_coordinates(lat, lng):
        """Helper which returns the country from the centroid"""
        url = "{0}/reverse?format=jsonv2&lat={1}&lon={2}&accept-language=en".format(
            OSM_NOMINATIM_SERVER_URL, lat, lng
        )
        try:
            country_info = requests.get(url).json()  # returns a dict
            if country_info["address"].get("country") is not None:
                return [country_info["address"]["country"]][0]
        except (KeyError, AttributeError, requests.exceptions.ConnectionError):
            pass
        return None

    @staticmethod
    def get_features_from_overpass(challenge: Challenge, query) -> None:
        """Attach features to challenge"""
        overpass = Overpass()
        # Check if the type is a node or a way or a relation which is in format (node[amenity=restaurant]])
        type = query.split("[")[0].split("(")[1]
        try:
            result = overpass.api.query(query)
        except Exception as e:
            raise BadRequest(message=f"error querying overpass: {e}")

        if result is None:
            return

        if type == "node":
            for node in result.nodes:
                feature = Overpass.node_to_features(node)
                challenge.features.append(feature)
        if type == "way":
            for way in result.ways:
                feature = Overpass.way_to_features(way)
                challenge.features.append(feature)
        if type == "relation":
            for relation in result.relations:
                feature = Overpass.relation_to_features(relation)
                challenge.features.append(feature)

    @staticmethod
    def can_user_view_challenge(user_id, challenge_id):
        """
        Checks if user is allowed to view challenge

        Parameters
        ----------
        user_id: int
            Requesting user id
        challenge_id: int
            Id of challenge requested by user.

        Returns
        -------
        True if user is permitted to view the challenge else False
        """
        if user_id and UserService.is_user_admin(user_id):
            return True

        challenge = Challenge.get_by_id(challenge_id)
        if challenge.private & challenge.created_by.id == user_id:
            return True
        else:
            return False
