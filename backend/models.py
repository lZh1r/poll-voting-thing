from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4
from sqlalchemy import DateTime, Enum as SqlEnum, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class PollStatus(str, Enum):
    active = "active"
    paused = "paused"
    finished = "finished"

class User(Base):
    __tablename__: str = "users"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    polls: Mapped[list["Poll"]] = relationship(back_populates="owner")

class Poll(Base):
    __tablename__: str = "polls"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    owner_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[PollStatus] = mapped_column(SqlEnum(PollStatus), default=PollStatus.active)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    owner: Mapped[User] = relationship(back_populates="polls")
    options: Mapped[list["PollOption"]] = relationship(
        back_populates="poll", cascade="all, delete-orphan", order_by="PollOption.position"
    )

class PollOption(Base):
    __tablename__: str = "poll_options"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    poll_id: Mapped[UUID] = mapped_column(ForeignKey("polls.id"), index=True)
    text: Mapped[str] = mapped_column(String(160))
    position: Mapped[int] = mapped_column(Integer)
    poll: Mapped[Poll] = relationship(back_populates="options")
    votes: Mapped[list["Vote"]] = relationship(back_populates="option", cascade="all, delete-orphan")

class Vote(Base):
    __tablename__: str = "votes"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    option_id: Mapped[UUID] = mapped_column(ForeignKey("poll_options.id"), index=True)
    option: Mapped[PollOption] = relationship(back_populates="votes")
