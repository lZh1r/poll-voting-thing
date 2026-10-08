from datetime import datetime, UTC
from enum import Enum
from uuid import UUID, uuid4
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


def utc_now() -> datetime:
    return datetime.now(UTC)


class PollStatus(str, Enum):
    active = "active"
    paused = "paused"
    finished = "finished"


class User(Base):
    __tablename__: str = "users"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    polls: Mapped[list["Poll"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan", passive_deletes=True
    )


class Poll(Base):
    __tablename__: str = "polls"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    owner_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[PollStatus] = mapped_column(
        SqlEnum(PollStatus, name="poll_status"), default=PollStatus.active
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    owner: Mapped[User] = relationship(back_populates="polls")
    options: Mapped[list["PollOption"]] = relationship(
        back_populates="poll",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="PollOption.position",
    )


class PollOption(Base):
    __tablename__: str = "poll_options"
    __table_args__ = (
        UniqueConstraint("poll_id", "position", name="uq_poll_option_position"),
        CheckConstraint("position >= 0", name="ck_poll_option_position"),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    poll_id: Mapped[UUID] = mapped_column(
        ForeignKey("polls.id", ondelete="CASCADE"), index=True
    )
    text: Mapped[str] = mapped_column(String(160))
    position: Mapped[int] = mapped_column(Integer)
    poll: Mapped[Poll] = relationship(back_populates="options")
    votes: Mapped[list["Vote"]] = relationship(
        back_populates="option", cascade="all, delete-orphan", passive_deletes=True
    )


class Vote(Base):
    __tablename__: str = "votes"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    option_id: Mapped[UUID] = mapped_column(
        ForeignKey("poll_options.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    option: Mapped[PollOption] = relationship(back_populates="votes")
