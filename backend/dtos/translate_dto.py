from pydantic import BaseModel
from backend.enum import TextStatus

class TranslateDTO(BaseModel):
    id: int
    text: str
    status: TextStatus
    corrected: str
    google_translate: str
    text_ne: str
    