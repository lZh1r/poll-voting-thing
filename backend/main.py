from fastapi import FastAPI

from .routers.polls import polls_router

app = FastAPI()

app.include_router(polls_router)