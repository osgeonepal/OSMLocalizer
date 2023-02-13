import datetime
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from sqlalchemy.sql.expression import func

from backend import db
from backend.models.sql.enum import TextStatus


class TranslateHistory(db.Model):
    """Describes history of text to translate"""

    __tablename__ = "translate_history"
    id = db.Column(db.Integer, primary_key=True)
    text_id = db.Column(db.Integer, db.ForeignKey("translate.id"), nullable=False)
    action = db.Column(db.Integer, nullable=False)
    action_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    def create(self):
        """Create new entry"""
        db.session.add(self)
        db.session.commit()

    def save(self):
        """Save changes to db"""
        db.session.commit()


class Translate(db.Model):
    """Describes status of text to translate"""

    __tablename__ = "translate"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    count = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    corrected = db.Column(db.String)
    google_translate = db.Column(db.String)
    text_ne = db.Column(db.String)

    def save(self):
        """Save changes to db"""
        db.session.commit()

    @staticmethod
    def get_by_id(text_id: int):
        return Translate.query.get(text_id)

    @staticmethod
    def get_to_translate_text():
        return (
            Translate.query.filter(Translate.status == TextStatus.TO_TRANSLATE.value)
            .order_by(func.random())
            .first()
        )

    @staticmethod
    def get_to_validate_text():
        return (
            Translate.query.filter(Translate.status == TextStatus.TRANSLATED.value)
            .order_by(func.random())
            .first()
        )

    @staticmethod
    def get_to_translate_text_as_dto():
        text = Translate.get_to_translate_text()
        return TranslateDTO(text)

    @staticmethod
    def get_to_validate_text_as_dto():
        text = Translate.get_to_validate_text()
        return TranslateDTO(text)

    @staticmethod
    def update_from_dto(translate_dto):
        text = Translate.get_by_id(translate_dto.id)
        text.status = TextStatus[translate_dto.status].value
        text.corrected = translate_dto.corrected
        text.text_ne = translate_dto.text_ne
        text.save()


TranslateDTO = sqlalchemy_to_pydantic(Translate)
