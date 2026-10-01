from uuid import UUID

from fastapi import APIRouter

from backend.schemas import UserData


user_router = APIRouter(prefix="/api/users")

@user_router.get("/{user_id}")
def get_user(user_id: UUID) -> UserData:
    pass
    
@user_router.post("")
def create_user(data: UserData) -> UserData:
    pass
    
@user_router.patch("/{user_id}")
def update_user(user_id: UUID, data: UserData) -> UserData:
    pass

@user_router.delete("/{user_id}")
def delete_user(user_id: UUID):
    pass