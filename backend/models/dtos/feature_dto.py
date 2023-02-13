from datetime import datetime
from pydantic import BaseModel

class CreateFeatureDTO(BaseModel):
    challenge_id: int
    osm_type: str
    osm_id: int
    geometry: str
    status: str
    
class FeatureDTO(BaseModel):
    id: int
    challenge_id: int
    osm_type: str
    osm_id: int
    geometry: str
    status: str
    changeset_id: int
    localized_by: str
    validated_by: str
    last_updated: datetime
    
    class Config:
        orm_mode = True
        json_encoders = {}
        json_decoders = {
            datetime: lambda v: datetime.fromisoformat(v)
        }
