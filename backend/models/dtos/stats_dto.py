from pydantic import BaseModel
from typing import Optional, List


class UserStatsDTO(BaseModel):
    username: str
    total_challenges: Optional[int]
    total_localized: int
    total_skipped: int


class ListUserStatsDTO(BaseModel):
    users: List[UserStatsDTO]
