from pydantic import BaseModel


class UserStatsDTO(BaseModel):
    username: str
    total_challenges: int
    total_localized: int
    total_validated: int
    total_skipped: int
    total_already_localized: int
    total_too_hard: int
    total_invalid_data: int
