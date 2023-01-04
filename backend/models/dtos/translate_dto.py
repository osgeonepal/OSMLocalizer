from pydantic import BaseModel


class UpdateTextDTO(BaseModel):
    id: int
    status: str
    corrected: str = None
    text_ne: str = None
