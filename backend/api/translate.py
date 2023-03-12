from flask import request
from flask_restful import Resource

from backend.services.translate_service import TranslateService
from backend.services.challenge_service import ChallengeService
from backend.services.user_service import auth


class TranslateTextAPI(Resource):
    @auth.login_required
    def get(self, challenge_id: int):
        """Translate text"""
        try:
            text = request.args.get("text")
            if not text:
                return {"error": "Missing text"}, 400
            challenge = ChallengeService.get_challenge_by_id(challenge_id)
            translated = TranslateService.translate_text(
                text,
                challenge.to_language,
                challenge.translate_engine,
                challenge.api_key,
            )
        except Exception as e:
            return {"error": str(e)}, 500
        return {"translated": translated}, 200
