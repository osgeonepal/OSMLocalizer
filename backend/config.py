import os
from dotenv import load_dotenv


class EnvironmentConfig:
    """Base class for configuration."""

    # Load configuration from file
    load_dotenv(
        os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "localizer.env"))
    )
    DEBUG = os.getenv("API_DEBUG", False)

    # Assamble the database uri
    POSTGRES_USER = os.getenv("POSTGRES_USER", None)
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", None)
    POSTGRES_ENDPOINT = os.getenv("POSTGRES_ENDPOINT", "postgresql")
    POSTGRES_DB = os.getenv("POSTGRES_DB", None)
    POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{POSTGRES_USER}"
        + f":{POSTGRES_PASSWORD}"
        + f"@{POSTGRES_ENDPOINT}:"
        + f"{POSTGRES_PORT}"
        + f"/{POSTGRES_DB}"
    )

    # Some more definitions (not overridable)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "max_overflow": 10,
    }
    SEND_FILE_MAX_AGE_DEFAULT = 0
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # OAuth2 configuration
    OAUTH2_CLIENT_ID = os.getenv("OAUTH2_CLIENT_ID", None)
    OAUTH2_CLIENT_SECRET = os.getenv("OAUTH2_CLIENT_SECRET", None)
    OAUTH2_REDIRECT_URI = os.getenv("OAUTH2_REDIRECT_URI", None)
    OAUTH2_AUTHORIZATION_BASE_URL = os.getenv("OAUTH2_AUTHORIZATION_BASE_URL", None)
    OAUTH2_TOKEN_URL = os.getenv("OAUTH2_TOKEN_URL", None)
    OAUTH2_SCOPE = os.getenv("OAUTH2_SCOPE", None)
    OAUTH2_USER_INFO_URL = os.getenv("OAUTH2_USER_INFO_URL", None)

    APP_SECRET_KEY = os.getenv("APP_SECRET_KEY", None)

    # Sentry configuration
    SENTRY_BACKEND_DSN = os.getenv("SENTRY_BACKEND_DSN", None)
    SENTRY_ENVIRONMENT = os.getenv("SENTRY_ENVIRONMENT", "development")
