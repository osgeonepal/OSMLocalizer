from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime
from geoalchemy2.elements import WKBElement


def convert_to_string(value):
    if value is None:
        return None
    return str(value)


class CreateChallengeDTO(BaseModel):
    """Create Challenge DTO for creating new challenge"""

    name: constr(min_length=1, max_length=100)
    description: constr(min_length=1, max_length=1000)
    status: str
    to_language: str
    overpass_query: str
    language_tags: str
    bbox: list
    translate_engine: str
    api_key: str
    due_date: Optional[str] = None

    class Config:
        orm_mode = True


class UpdateChallengeDTO(BaseModel):
    """Update Challenge DTO for updating existing challenge"""

    name: constr(min_length=1, max_length=100)
    description: str
    due_date: str
    status: int


class ChallengeDTO(BaseModel):
    """Challenge DTO for returning challenge"""

    id: int
    name: str
    description: str
    status: int
    country: str
    to_language: str
    due_date: datetime
    created: datetime
    last_updated: datetime
    bbox: Optional[dict]
    centroid: Optional[str] = None
    language_tags: list

    class Config:
        orm_mode = True
        json_encoders = {}
        # json_decoders = {datetime: lambda v: datetime.fromisoformat(v)}


class ChallengeSummaryDTO(BaseModel):
    """Challenge Summary DTO for returning challenge summary"""

    id: int
    name: str
    description: str
    due_date: str
    status: int
    to_language: str
    last_updated: str
    centroid: Optional[dict] = None
    country: str
    bbox: Optional[dict] = None

    class Config:
        orm_mode = True
        json_encoders = {}
        # json_decoders = {datetime: lambda v: datetime.fromisoformat(v)}


class ChallengeListDTO(BaseModel):
    """Challenge List DTO for returning list of challenges"""

    challenges: list
