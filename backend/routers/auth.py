from fastapi import APIRouter, Request, Response, status

from backend.database import DatabaseSession
from backend.schemas import UserCreate, UserData, UserLogin
from backend.services import auth, users
from backend.services.auth import CurrentUser

auth_router = APIRouter(prefix="/api/auth", tags=["Auth"])


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: DatabaseSession, response: Response) -> UserData:
    user = users.create_user(session, data)
    auth.set_cookies(response, *auth.sign_in(session, user))
    return UserData.model_validate(user)


@auth_router.post("/login")
def login(data: UserLogin, session: DatabaseSession, response: Response) -> UserData:
    user = auth.authenticate(session, str(data.email), data.password)
    auth.set_cookies(response, *auth.sign_in(session, user))
    return UserData.model_validate(user)


@auth_router.post("/refresh")
def refresh(request: Request, session: DatabaseSession, response: Response) -> dict[str, str]:
    auth.set_cookies(response, *auth.refresh_session(session, request.cookies.get(auth.REFRESH_COOKIE)))
    return {"status": "refreshed"}


@auth_router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, session: DatabaseSession, response: Response) -> None:
    auth.revoke_session(session, request.cookies.get(auth.REFRESH_COOKIE))
    auth.clear_cookies(response)


@auth_router.get("/me")
def me(user: CurrentUser) -> UserData:
    return UserData.model_validate(user)
