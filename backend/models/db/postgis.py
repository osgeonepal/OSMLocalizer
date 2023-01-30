from geoalchemy2 import Geometry
from geoalchemy2.functions import GenericFunction


class ST_Transform(GenericFunction):
    """Exposes PostGIS ST_Transform function"""

    name = "ST_Transform"
    type = Geometry


class ST_Area(GenericFunction):
    """Exposes PostGIS ST_Area function"""

    name = "ST_Area"
    type = None


class ST_GeomFromGeoJSON(GenericFunction):
    """Exposes PostGIS ST_GeomFromGeoJSON function"""

    name = "ST_GeomFromGeoJSON"
    type = Geometry


class ST_SetSRID(GenericFunction):
    """Exposes PostGIS ST_SetSRID function"""

    name = "ST_SetSRID"
    type = Geometry
