from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr
from .models import PollStatus


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserData(BaseModel):
    id: UUID
    name: str
    email: str

class PollCreate(BaseModel):
    title: str
    description: str
    options: list[str]

class PollUpdate(BaseModel):
    status: PollStatus | None
    options: list[str] | None

class PollOptionStatus(BaseModel):
    id: UUID
    text: str
    votes: int
    
class PollPreview(BaseModel):
    id: UUID
    title: str
    status: PollStatus
    total_votes: int

class PollInternalStatus(BaseModel):
    id: UUID
    title: str
    description: str
    status: PollStatus
    total_votes: int
    options: list[PollOptionStatus]
    created_at: datetime

class PublicOptionStatus(BaseModel):
    id: UUID
    text: str

class PublicPollStatus(BaseModel):
    id: UUID
    title: str
    description: str
    status: PollStatus
    options: list[PublicOptionStatus]

class VoteRequest(BaseModel):
    option_id: UUID
