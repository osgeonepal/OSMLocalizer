from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime


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
    translate_engine: Optional[str]
    api_key: Optional[str]
    due_date: Optional[str] = None
    created_by: int
    feature_instructions: Optional[str] = None

    class Config:
        orm_mode = True


class UpdateChallengeDTO(BaseModel):
    """Update Challenge DTO for updating existing challenge"""

    name: constr(min_length=1, max_length=100)
    description: constr(min_length=1, max_length=1000)
    status: str
    to_language: str
    language_tags: str
    translate_engine: Optional[str]
    api_key: Optional[str]
    due_date: Optional[str] = None
    feature_instructions: Optional[str] = None


class ChallengeStatsDTO(BaseModel):
    total: int
    localized: int
    validated: int
    skipped: int
    already_localized: int
    too_hard: int
    invalid_data: int
    to_localize: int


class ChallengeDTO(BaseModel):
    """Challenge DTO for returning challenge"""

    id: int
    name: str
    description: str
    status: str
    country: str
    to_language: str
    due_date: datetime
    created: datetime
    last_updated: datetime
    bbox: Optional[dict]
    centroid: Optional[str] = None
    language_tags: str
    translate_engine: Optional[str] = None
    stats: Optional[ChallengeStatsDTO] = None
    feature_instructions: Optional[str] = None

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
    created: str
    bbox: Optional[dict] = None
    stats: Optional[ChallengeStatsDTO] = None

    class Config:
        orm_mode = True
        json_encoders = {}
        # json_decoders = {datetime: lambda v: datetime.fromisoformat(v)}


class ChallengeListDTO(BaseModel):
    """Challenge List DTO for returning list of challenges"""

    challenges: list
