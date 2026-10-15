from datetime import timedelta
from hashlib import sha256
from secrets import token_urlsafe
from typing import Annotated
from uuid import UUID

import jwt
from argon2.exceptions import VerificationError
from fastapi import Depends, Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import DatabaseSession
from backend.errors import RefreshRequiredError, UnauthorizedError
from backend.models import RefreshSession, User, utc_now
from backend.services.users import password_hasher

ACCESS_SECONDS = 3 * 60 * 60
REFRESH_SECONDS = 7 * 24 * 60 * 60
ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_session"


def token_hash(token: str) -> str:
    return sha256(token.encode()).hexdigest()


def active_session(session: Session, token: str | None, *, lock: bool = False) -> RefreshSession | None:
    if not token:
        return None
    query = select(RefreshSession).where(RefreshSession.token_hash == token_hash(token))
    if lock:
        query = query.with_for_update()
    record = session.scalar(query)
    if record is None or record.revoked_at is not None or record.expires_at <= utc_now():
        return None
    return record


def sign_in(session: Session, user: User) -> tuple[str, str]:
    refresh_token = token_urlsafe(48)
    record = RefreshSession(
        user_id=user.id,
        token_hash=token_hash(refresh_token),
        expires_at=utc_now() + timedelta(seconds=REFRESH_SECONDS),
    )
    session.add(record)
    session.flush()
    return access_token(user, record), refresh_token


def access_token(user: User, record: RefreshSession) -> str:
    now = utc_now()
    return jwt.encode(
        {"sub": str(user.id), "sid": str(record.id), "iat": now, "exp": now + timedelta(seconds=ACCESS_SECONDS)},
        settings.jwt_secret.get_secret_value(),
        algorithm="HS256",
    )


def set_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(ACCESS_COOKIE, access, max_age=ACCESS_SECONDS, httponly=True, secure=settings.secure_cookies, samesite="strict", path="/")
    response.set_cookie(REFRESH_COOKIE, refresh, max_age=REFRESH_SECONDS, httponly=True, secure=settings.secure_cookies, samesite="strict", path="/api")


def clear_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/api")


def authenticate(session: Session, email: str, password: str) -> User:
    user = session.scalar(select(User).where(User.email == email.lower()))
    if user is None or user.password_hash is None:
        raise UnauthorizedError("Неверный email или пароль")
    try:
        _ = password_hasher.verify(user.password_hash, password)
    except VerificationError as error:
        raise UnauthorizedError("Неверный email или пароль") from error
    return user


def refresh_session(session: Session, token: str | None) -> tuple[str, str]:
    record = active_session(session, token, lock=True)
    if record is None:
        raise UnauthorizedError("Сессия истекла или отозвана")
    new_refresh = token_urlsafe(48)
    record.token_hash = token_hash(new_refresh)
    session.flush()
    return access_token(record.user, record), new_refresh


def revoke_session(session: Session, token: str | None) -> None:
    record = active_session(session, token, lock=True)
    if record is not None:
        record.revoked_at = utc_now()


def get_current_user(session: DatabaseSession, request: Request) -> User:
    access = request.cookies.get(ACCESS_COOKIE)
    if access:
        try:
            claims = jwt.decode(
                access,
                settings.jwt_secret.get_secret_value(),
                algorithms=["HS256"],
                options={"require": ["sub", "sid", "exp", "iat"]},
            )
            user_id = UUID(claims["sub"])
            session_id = UUID(claims["sid"])
            record = session.get(RefreshSession, session_id)
            if record is not None and record.user_id == user_id and record.revoked_at is None and record.expires_at > utc_now():
                return record.user
        except (jwt.InvalidTokenError, ValueError, TypeError, KeyError):
            pass
    if active_session(session, request.cookies.get(REFRESH_COOKIE)) is not None:
        raise RefreshRequiredError()
    raise UnauthorizedError()


CurrentUser = Annotated[User, Depends(get_current_user)]
