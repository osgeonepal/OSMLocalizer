from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class CreateFeatureDTO(BaseModel):
    challenge_id: int
    osm_type: str
    geometry: str
    status: str


class FeatureDTO(BaseModel):
    id: int
    challenge_id: int
    osm_type: str
    geometry: str
    status: str
    localized_by: str
    validated_by: str
    last_updated: datetime


class NearbyDTO(BaseModel):
    id: int
    distance: float


class NearbyFeatureDTO(BaseModel):
    feature: FeatureDTO
    nearby: Optional[NearbyDTO]

    class Config:
        orm_mode = True
        json_encoders = {}
        json_decoders = {datetime: lambda v: datetime.fromisoformat(v)}
