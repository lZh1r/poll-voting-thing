from fastapi import FastAPI

from backend.routers.users import user_router
from backend.routers.votes import votes_router

from .routers.polls import polls_router

app = FastAPI()

app.include_router(polls_router)
app.include_router(votes_router)
app.include_router(user_router)