from flask_restful import Resource
from flask import jsonify

from backend.services.challenge_service import ChallengeService
from backend.models.dtos.challenge_dto import CreateChallengeDTO, UpdateChallengeDTO
from backend.models.sql.enum import ChallengeStatus
from backend.services.user_service import auth


class Challenge(Resource):
    """Challenge resource"""

    def get(self, challenge_id: int):
        """Get challenge by id"""
        challenge_dto = ChallengeService.get_challenge_as_dto(challenge_id)
        return jsonify(challenge_dto.dict())

    def patch(self, challenge_id: int):
        """Update existing challenge"""
        challenge_dto = UpdateChallengeDTO(**self.api.payload)
        ChallengeService.update_challenge(challenge_id, challenge_dto)
        return {"success": "yes"}

    def delete(self, challenge_id: int):
        """Delete challenge by id"""
        return ChallengeService.delete_challenge(challenge_id)

    @auth.login_required
    def post(self):
        """Create new challenge"""
        current_user = auth.current_user()
        self.api.payload["created_by"] = current_user
        challenge_dto = CreateChallengeDTO(**self.api.payload)
        if ChallengeService.create_challenge(challenge_dto):
            return {"success": "yes"}, 201
        return {"success": "no"}, 400


class ChallengeList(Resource):
    """Challenge list resource"""

    def get(self):
        """Get all challenges"""
        return jsonify(
            ChallengeService.get_all_challenges_by_status(
                ChallengeStatus.PUBLISHED.value
            ).dict()
        )
