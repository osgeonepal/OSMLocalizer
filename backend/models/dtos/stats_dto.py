from pydantic import BaseModel
from typing import Optional, List


class HomeStatsDTO(BaseModel):
    total_challenges: int
    total_localized: int
    total_users: int


class UserStatsDTO(BaseModel):
    username: str
    picture_url: Optional[str]
    total_challenges: Optional[int]
    total_localized: int
    total_skipped: int
    total_validated_by_me: int
    total_invalidated_by_me: int
    total_my_validated: int
    total_my_invalidated: int
    top_challenges_contributed: Optional[List[dict]]
    total_contributions: Optional[int]


class ListUserStatsDTO(BaseModel):
    users: List[UserStatsDTO]
