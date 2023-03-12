import requests

from backend.models.sql.enum import TranslateEngine
from backend.errors import NotFound, BadRequest


class TranslateService:
    @staticmethod
    def translate_from_google(text, language, api_key):
        """Translate text from google"""
        url = "https://translation.googleapis.com/language/translate/v2"
        params = {
            "key": api_key,
            "q": text,
            "target": language,
        }
        response = requests.get(url, params=params)
        return response.json()["data"]["translations"][0]["translatedText"]

    @staticmethod
    def translate_from_yandex(text, language, api_key):
        """Translate text from yandex"""
        url = "https://translate.yandex.net/api/v1.5/tr.json/translate"
        params = {
            "key": api_key,
            "text": text,
            "lang": language,
        }
        response = requests.get(url, params=params)
        return response.json()["text"][0]

    @staticmethod
    def translate_from_microsoft(text, language, api_key):
        """Translate text from microsoft"""
        url = "https://api.cognitive.microsofttranslator.com/translate"
        params = {
            "api-version": "3.0",
            "to": language,
        }
        headers = {
            "Ocp-Apim-Subscription-Key": api_key,
            "Ocp-Apim-Subscription-Region": "global",
            "Content-type": "application/json",
        }
        body = [{"text": text}]
        response = requests.post(url, params=params, headers=headers, json=body)
        return response.json()[0]["translations"][0]["text"]

    @staticmethod
    def translate_text(text, language, engine, api_key):
        """Translate text from api"""
        try:
            if engine == TranslateEngine.GOOGLE.value:
                return TranslateService.translate_from_google(text, language, api_key)
            elif engine == TranslateEngine.YANDEX.value:
                return TranslateService.translate_from_yandex(text, language, api_key)
            elif engine == TranslateEngine.MICROSOFT.value:
                return TranslateService.translate_from_microsoft(
                    text, language, api_key
                )
            else:
                raise NotFound("NO_TRANSLATE_ENGINE")
        except Exception as e:
            raise BadRequest(message=f"Error translating text: {e}")
