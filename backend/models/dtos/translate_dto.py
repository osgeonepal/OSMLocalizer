from pydantic import BaseModel


class UpdateTextDTO(BaseModel):
    id: int
    status: str
    corrected: str
    text_ne: str
