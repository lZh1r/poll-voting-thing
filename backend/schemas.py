from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    field_validator,
    model_validator,
)

from backend.models import PollStatus

ShortText = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)
]
Description = Annotated[str, StringConstraints(strip_whitespace=True, max_length=500)]
Options = Annotated[list[ShortText], Field(min_length=2, max_length=100)]


class RequestSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")


class UpdateSchema(RequestSchema):
    @model_validator(mode="after")
    def validate_changes(self):
        if not self.model_fields_set:
            raise ValueError("Передайте хотя бы одно поле для изменения")
        if any(getattr(self, field) is None for field in self.model_fields_set):
            raise ValueError("Изменяемые поля не могут быть null")
        return self


class UserCreate(RequestSchema):
    name: ShortText
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class UserUpdate(UpdateSchema):
    name: ShortText | None = None
    email: EmailStr | None = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str | None) -> str | None:
        return value.lower() if value is not None else None


class UserData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: EmailStr


class PollCreate(RequestSchema):
    owner_id: UUID
    title: ShortText
    description: Description = ""
    options: Options

    @field_validator("options")
    @classmethod
    def validate_unique_options(cls, value: list[str]) -> list[str]:
        if len({option.casefold() for option in value}) != len(value):
            raise ValueError("Варианты ответа должны быть уникальными")
        return value


class PollUpdate(UpdateSchema):
    owner_id: UUID | None = None
    title: ShortText | None = None
    description: Description | None = None
    status: PollStatus | None = None
    options: Options | None = None

    @field_validator("options")
    @classmethod
    def validate_unique_options(cls, value: list[str] | None) -> list[str] | None:
        if value is not None:
            return PollCreate.validate_unique_options(value)
        return value


class PollOptionStatus(BaseModel):
    id: UUID
    text: str
    votes: int = Field(ge=0)


class PollPreview(BaseModel):
    id: UUID
    owner_id: UUID
    title: str
    description: str
    status: PollStatus
    total_votes: int = Field(ge=0)
    created_at: datetime


class PollInternalStatus(PollPreview):
    options: list[PollOptionStatus]


class PublicOptionStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    text: str


class PublicPollStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    status: PollStatus
    options: list[PublicOptionStatus]


class VoteRequest(RequestSchema):
    option_id: UUID


class VoteData(BaseModel):
    id: UUID
    poll_id: UUID
    option_id: UUID
    created_at: datetime
