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

    def get_count(self, query: str) -> dict:
        """Get the number of each feature types in the query"""
        api_result = self.api.query(query)
        return {
            "node": len(api_result.nodes),
            "way": len(api_result.ways),
            "relation": len(api_result.relations),
        }

    @staticmethod
    def node_to_features(node: overpy.Node) -> Feature:
        feature = Feature()
        feature.id = node.id
        feature.osm_type = "node"
        feature.status = FeatureStatus.TO_LOCALIZE.value
        geometry = Overpass.coordinates_to_point(float(node.lon), float(node.lat))
        feature.geometry = f"SRID=4326;{geometry.wkt}"
        return feature

    @staticmethod
    def way_to_features(way: overpy.Way) -> Feature:
        feature = Feature()
        feature.id = way.id
        feature.osm_type = "way"
        feature.status = FeatureStatus.TO_LOCALIZE.value
        geometry = Overpass.coordinates_to_point(0, 0)
        feature.geometry = f"SRID=4326;{geometry.wkt}"
        return feature

    @staticmethod
    def relation_to_features(relation: overpy.Relation) -> Feature:
        feature = Feature()
        feature.id = relation.id
        feature.osm_type = "relation"
        feature.status = FeatureStatus.TO_LOCALIZE.value
        geometry = Overpass.coordinates_to_point(0, 0)
        feature.geometry = f"SRID=4326;{geometry.wkt}"
        return feature

    @staticmethod
    def coordinates_to_point(lon: float, lat: float) -> Point:
        shapely_point = Point(lon, lat)
        geometry = shape.from_shape(shapely_point, 4326)
        geom_4326 = db.engine.execute(ST_Transform(geometry, 4326)).scalar()
        return shape.to_shape(geom_4326)

    @staticmethod
    def get_query_feature_count(overpass_query: str) -> dict:
        """Get the number of features in the user query"""
        overpass = Overpass()

        query_type = overpass_query.split("[")[0].split("(")[1]
        # Convert bbox to [min_lat, min_lon, max_lat, max_lon] format for Overpass

        result = overpass.get_count(overpass_query)
        return {"count": result[query_type]}
