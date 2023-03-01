import overpy
from shapely.geometry import Point
from geoalchemy2 import shape

from backend import db
from backend.models.sql.features import Feature
from backend.models.sql.postgis import ST_Transform
from backend.models.sql.enum import FeatureStatus


class Overpass:
    def __init__(self) -> None:
        self.api = overpy.Overpass()

    def get_nodes(self, query: str) -> list:
        api_result = self.api.query(query)
        nodes = []
        for node in api_result.nodes:
            nodes.append(node)
        return nodes

    def get_ways(self, query: str) -> list:
        api_result = self.api.query(query)
        ways = []
        for way in api_result.ways:
            ways.append(way)
        return ways

    def as_json(self, query: str) -> dict:
        api_result = self.api.query(query)
        return api_result.get_json()

    @staticmethod
    def node_to_features(node: overpy.Node, feature_id) -> Feature:
        feature = Feature()
        feature.id = node.id
        feature.osm_type = "node"
        feature.status = FeatureStatus.TO_LOCALIZE.value
        geometry = Overpass.coordinates_to_point(float(node.lon), float(node.lat))
        feature.geometry = f"SRID=4326;{geometry.wkt}"
        return feature

    @staticmethod
    def coordinates_to_point(lon: float, lat: float) -> Point:
        shapely_point = Point(lon, lat)
        geometry = shape.from_shape(shapely_point, 4326)
        geom_4326 = db.engine.execute(ST_Transform(geometry, 4326)).scalar()
        return shape.to_shape(geom_4326)
