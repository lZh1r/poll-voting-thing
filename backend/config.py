from pathlib import Path

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL, make_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).with_name(".env"),
        extra="ignore",
    )

    postgres_host: str = "localhost"
    postgres_port: int = Field(default=5432, ge=1, le=65535)
    postgres_db: str = "polls"
    postgres_user: str = "polls"
    postgres_password: SecretStr = SecretStr("")
    database_url: SecretStr | None = None
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, value: SecretStr | None) -> SecretStr | None:
        if value is not None:
            url = make_url(value.get_secret_value())
            if url.get_backend_name() != "postgresql":
                raise ValueError("bad DATABASE_URL")
            if url.drivername not in {"postgresql", "postgresql+psycopg"}:
                raise ValueError("no postgresql+psycopg")
        return value

    @property
    def sqlalchemy_url(self) -> URL:
        if self.database_url is not None:
            return make_url(self.database_url.get_secret_value()).set(
                drivername="postgresql+psycopg"
            )
        return URL.create(
            drivername="postgresql+psycopg",
            username=self.postgres_user,
            password=self.postgres_password.get_secret_value(),
            host=self.postgres_host,
            port=self.postgres_port,
            database=self.postgres_db,
        )


settings = Settings()
