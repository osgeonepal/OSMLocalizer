from pydantic import BaseModel

class CreateFeatureDTO(BaseModel):
    challenge_id: int
    osm_type: str
    osm_id: int
    geometry: str
    status: str