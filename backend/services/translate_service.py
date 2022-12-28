from backend.models.sqlalchemy.translate import Translate, TranslateHistory
from backend.models.dtos.translate_dto import UpdateTextDTO
from backend.enum import TextStatus

class TranslateService():
    @staticmethod
    def update_translate(update_dto:UpdateTextDTO ):
        Translate.update_from_dto(update_dto)
        translate_history = TranslateHistory()
        translate_history.text_id = update_dto.id
        translate_history.action = update_dto.status
        translate_history.create()
        
    @staticmethod
    def is_valid_status(status):
        try:
            TextStatus[status]
            return True
        except KeyError:
            return False