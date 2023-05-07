from pydantic import BaseModel, constr, validator
from typing import Optional
from datetime import datetime

from backend.models.sql.enum import ChallengeStatus


def convert_to_string(value):
    if value is None:
        return None
    return str(value)


def validate_challenge_status(value):
    """Validate challenge status"""
    if value.lower() not in ["draft", "published", "archived", "all"]:
        raise ValueError(
            "Invalid challenge status. Valid values are draft, published, archived, all"
        )
    else:
        if value.lower() == "all":
            return None
        value = ChallengeStatus[value.upper()].value
    return value


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
    total_contributors: Optional[int] = None

    class Config:
        orm_mode = True
        json_encoders = {}
        # json_decoders = {datetime: lambda v: datetime.fromisoformat(v)}


class PaginationDTO(BaseModel):
    def __init__(self, paginated_result):
        super().__init__(
            total_pages=paginated_result.pages,
            current_page=paginated_result.page,
            total_items=paginated_result.total,
        )

    total_pages: int
    current_page: int
    total_items: int


class ChallengeListDTO(BaseModel):
    """Challenge List DTO for returning list of challenges"""

    challenges: list
    pagination: PaginationDTO


class SearchChallengeDTO(BaseModel):
    """Search Challenge DTO for returning list of challenges"""

    status: Optional[str] = ChallengeStatus.PUBLISHED.value
    country: Optional[str] = None
    to_language: Optional[str] = None
    name: Optional[str] = None
    sort_by: Optional[str] = "NEWEST"
    sort_order: Optional[str] = "DESC"
    created_by: Optional[int] = None
    per_page: Optional[int] = 6
    page: Optional[int] = 1

    @validator("status")
    def validate_status(cls, value):
        """Validate challenge status"""
        return validate_challenge_status(value)
