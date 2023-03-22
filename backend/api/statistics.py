from flask_restful import Resource
from flask import request
from datetime import datetime

from backend.services.stats_service import StatsService


class HomeStatsAPI(Resource):
    def get(self):
        return StatsService.get_home_page_stats().dict()


class UserStatSAPI(Resource):
    def get(self, user_id):
        challenge_id = request.args.get("challengeId", None)
        return StatsService.get_user_stats(user_id, challenge_id).dict()


class ChallengeContributorsStatsAPI(Resource):
    def get(self, challenge_id):
        start_date = request.args.get("startDate", None)
        end_date = request.args.get("endDate", None)
        if start_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
        if end_date:
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
        return StatsService.get_challenge_contributors_stats(
            challenge_id, start_date, end_date
        ).dict()
