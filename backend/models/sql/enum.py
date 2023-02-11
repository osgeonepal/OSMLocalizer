from enum import Enum


class FeatureStatus(Enum):
    TO_LOCALIZE = 0
    LOCALIZED = 1
    VALIDATED = 2
    
