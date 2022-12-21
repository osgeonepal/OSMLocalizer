from pydantic import BaseModel


class UpdateTextDTO(BaseModel):
    id: int
    status: int
    corrected: str
    text_ne: str
