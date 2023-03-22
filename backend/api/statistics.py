from flask_restful import Resource
from flask import request
from backend.services.stats_service import StatsService


class UserStatSAPI(Resource):
    def get(self, user_id):
        challenge_id = request.args.get("challengeId", None)
        return StatsService.get_user_stats(user_id, challenge_id).dict()


class ChallengeContributorsStatsAPI(Resource):
    def get(self, challenge_id):
        return StatsService.get_challenge_contributors_stats(challenge_id).dict()
