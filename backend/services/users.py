from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.errors import ConflictError, NotFoundError
from backend.models import User
from backend.schemas import UserCreate, UserUpdate


def get_user(session: Session, user_id: UUID) -> User:
    user = session.get(User, user_id)
    if user is None:
        raise NotFoundError("Пользователь не найден")
    return user


def list_users(session: Session, offset: int, limit: int) -> list[User]:
    return list(
        session.scalars(select(User).order_by(User.name, User.id).offset(offset).limit(limit))
    )


def ensure_email_available(
    session: Session, email: str, user_id: UUID | None = None
) -> None:
    query = select(User.id).where(User.email == email)
    if user_id is not None:
        query = query.where(User.id != user_id)
    if session.scalar(query) is not None:
        raise ConflictError("Пользователь с таким email уже существует")


def create_user(session: Session, data: UserCreate) -> User:
    ensure_email_available(session, str(data.email))
    user = User(**data.model_dump())
    session.add(user)
    session.flush()
    return user


def update_user(session: Session, user_id: UUID, data: UserUpdate) -> User:
    user = get_user(session, user_id)
    if data.email is not None:
        ensure_email_available(session, str(data.email), user_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    session.flush()
    return user


def delete_user(session: Session, user_id: UUID) -> None:
    session.delete(get_user(session, user_id))
    session.flush()
