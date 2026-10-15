from uuid import UUID

from fastapi import APIRouter, Response, status

from backend.database import DatabaseSession
from backend.errors import ForbiddenError
from backend.schemas import UserData, UserUpdate
from backend.services import users
from backend.services.auth import CurrentUser

user_router = APIRouter(prefix="/api/users", tags=["Users"])


@user_router.get("/{user_id}")
def get_user(user_id: UUID, user: CurrentUser) -> UserData:
    if user_id != user.id:
        raise ForbiddenError()
    return UserData.model_validate(user)


@user_router.patch("/{user_id}")
def update_user(user_id: UUID, data: UserUpdate, session: DatabaseSession, user: CurrentUser) -> UserData:
    if user_id != user.id:
        raise ForbiddenError()
    return UserData.model_validate(users.update_user(session, user_id, data))


@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, session: DatabaseSession, user: CurrentUser) -> Response:
    if user_id != user.id:
        raise ForbiddenError()
    users.delete_user(session, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
