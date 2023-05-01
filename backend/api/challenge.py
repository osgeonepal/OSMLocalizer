from flask_restful import Resource
from flask import jsonify, request
from pydantic import ValidationError

from backend.services.challenge_service import ChallengeService
from backend.models.dtos.challenge_dto import (
    CreateChallengeDTO,
    UpdateChallengeDTO,
    SearchChallengeDTO,
)
from backend.services.user_service import auth
from backend.errors import BadRequest


class Challenge(Resource):
    """Challenge resource"""

    def get(self, challenge_id: int):
        """Get challenge by id"""
        challenge_dto = ChallengeService.get_challenge_as_dto(challenge_id)
        return jsonify(challenge_dto.dict())

    def patch(self, challenge_id: int):
        """Update existing challenge"""
        challenge_dto = UpdateChallengeDTO(**request.get_json())
        ChallengeService.update_challenge(challenge_id, challenge_dto)
        return {"success": True}

    def delete(self, challenge_id: int):
        """Delete challenge by id"""
        return ChallengeService.delete_challenge(challenge_id)

    @auth.login_required
    def post(self):
        """Create new challenge"""
        current_user = auth.current_user()
        request.get_json()["created_by"] = current_user
        challenge_dto = CreateChallengeDTO(**request.get_json())
        if ChallengeService.create_challenge(challenge_dto):
            return {"success": True}, 201
        return {"success": False}, 400


class ChallengeList(Resource):
    """Challenge list resource"""

    def get(self):
        """Get all challenges"""
        try:
            search_challenge_dto = SearchChallengeDTO(**request.args)
        except ValidationError as e:
            raise BadRequest(message=e.__str__())
        return jsonify(ChallengeService.get_all_challenges(search_challenge_dto).dict())
