from pydantic import BaseModel
from typing import Optional


class UserStatsDTO(BaseModel):
    username: str
    total_challenges: Optional[int]
    total_localized: int
    total_skipped: int
