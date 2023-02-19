from enum import Enum


class FeatureStatus(Enum):
    TO_LOCALIZE = 0
    LOCALIZED = 1
    VALIDATED = 2
    TO_UPLOAD = 3
    DUPLICATE = 5
    TOO_HARD = 6
    SKIPPED = 7
    ALREADY_LOCALIZED = 8


class ChallengeStatus(Enum):
    DRAFT = 0
    PUBLISHED = 1
    ARCHIVED = 2


class TranslateEngine(Enum):
    GOOGLE = 0
    YANDEX = 1
    MICROSOFT = 2
