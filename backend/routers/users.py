from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from backend.database import DatabaseSession
from backend.schemas import UserCreate, UserData, UserUpdate
from backend.services import users

user_router = APIRouter(prefix="/api/users", tags=["Users"])


@user_router.get("")
def list_users(
    session: DatabaseSession,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[UserData]:
    return [UserData.model_validate(user) for user in users.list_users(session, offset, limit)]


@user_router.get("/{user_id}")
def get_user(user_id: UUID, session: DatabaseSession) -> UserData:
    return UserData.model_validate(users.get_user(session, user_id))


@user_router.post("", status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate, session: DatabaseSession) -> UserData:
    return UserData.model_validate(users.create_user(session, data))


@user_router.patch("/{user_id}")
def update_user(user_id: UUID, data: UserUpdate, session: DatabaseSession) -> UserData:
    return UserData.model_validate(users.update_user(session, user_id, data))


@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, session: DatabaseSession) -> Response:
    users.delete_user(session, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
