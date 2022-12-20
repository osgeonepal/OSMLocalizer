from enum import Enum

class TextStatus(Enum):
    TO_TRANSLATE = 0
    TRANSLATED = 1
    VALIDATED = 2
    NEEDS_CORRECTION = 3
    NEEDS_CONTEXT = 4
