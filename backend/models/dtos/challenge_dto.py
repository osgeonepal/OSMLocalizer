from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime
from geoalchemy2.elements import WKBElement


from backend import db

def convert_to_string(value):
    if value is None:
        return None
    return str(value)


class CreateChallengeDTO(BaseModel):
    """Create Challenge DTO for creating new challenge"""

    name: constr(min_length=1, max_length=100)
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: int
    bbox: Optional[str] = None
    centroid: Optional[str] = None
    language_tags: list
    feature_tags: list
    country: str

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
    due_date: datetime
    status: int
    created: datetime
    last_updated: datetime
    bbox: Optional[dict]
    centroid: Optional[str] = None
    language_tags: list
    feature_tags: list
    country: str

    class Config:
        orm_mode = True
        json_encoders = {}
        json_decoders = {
            datetime: lambda v: datetime.fromisoformat(v)
        }

class ChallengeSummaryDTO(BaseModel):
    """Challenge Summary DTO for returning challenge summary"""

    id: int
    name: str
    description: str
    due_date: datetime
    status: int
    created: datetime
    last_updated: datetime
    centroid: Optional[dict] = None
    language_tags: list
    feature_tags: list
    country: str

    class Config:
        orm_mode = True
        json_encoders = {}
        json_decoders = {
            datetime: lambda v: datetime.fromisoformat(v)
        }

class ChallengeListDTO(BaseModel):
    """Challenge List DTO for returning list of challenges"""

    challenges: list
