import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "mock_key")
    github_ai_scan_enabled: bool = os.getenv("GITHUB_AI_SCAN_ENABLED", "true").lower() == "true"
    ai_service_port: int = int(os.getenv("PORT", "8000"))
    log_level: str = os.getenv("LOG_LEVEL", "info")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
