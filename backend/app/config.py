import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: List[str] = [
        "http://localhost:9000",
        "http://127.0.0.1:9000",
        "http://localhost:9001",
        "http://127.0.0.1:9001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # JWT Security
    JWT_SECRET_KEY: str = "learningpath_ai_super_secret_jwt_key_2026_dev_sec_9999"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    MONGODB_ENABLED: str = "auto"  # "auto", "true", "false"
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "learningpath_ai"

    # Firecrawl Web Intelligence
    FIRECRAWL_API_KEY: str = ""
    FIRECRAWL_BASE_URL: str = "https://api.firecrawl.dev/v1"

    # Memento Memory
    MEMENTO_API_KEY: str = ""
    MEMENTO_API_URL: str = "https://api.mem0.ai/v1"
    MEMENTO_STORAGE_MODE: str = "bitemporal_hybrid"

    # LLM Settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: str = ""
    LLM_PROVIDER: str = "auto"

    DEMO_MODE: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
