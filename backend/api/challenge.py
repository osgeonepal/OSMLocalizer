from flask_restx import Resource
from flask import jsonify

from backend.services.challenge_service import ChallengeService
from backend.models.dtos.challenge_dto import CreateChallengeDTO, UpdateChallengeDTO


class Challenge(Resource):
    """Challenge resource"""

    def get(self, challenge_id: int):
        """Get challenge by id"""
        return jsonify(ChallengeService.get_challenge_by_id(challenge_id).dict())

    def patch(self, challenge_id: int):
        """Update existing challenge"""
        challenge_dto = UpdateChallengeDTO(**self.api.payload)
        return ChallengeService.update_challenge(challenge_id, challenge_dto)

    def delete(self, challenge_id: int):
        """Delete challenge by id"""
        return ChallengeService.delete_challenge(challenge_id)

    def post(self):
        """Create new challenge"""
        challenge_dto = CreateChallengeDTO(**self.api.payload)
        return jsonify(ChallengeService.create_challenge(challenge_dto).dict())

class ChallengeList(Resource):
    """Challenge list resource"""

    def get(self):
        """Get all challenges"""
        return jsonify(ChallengeService.get_all_challenges().dict())
