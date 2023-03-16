from pydantic import BaseModel
from typing import Optional


class UserDTO(BaseModel):
    id: int
    username: str
    role: int
    level: int
    date_registered: str
    picture_url: Optional[str]


class UserLoginDTO(BaseModel):
    user: UserDTO
    jwt_token: str
    osm_token: str
