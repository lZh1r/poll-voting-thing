import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from starlette.concurrency import run_in_threadpool

from backend.config import settings
from backend.database import Base, engine
from backend.errors import ApplicationError
from backend.routers.polls import polls_router
from backend.routers.users import user_router
from backend.routers.votes import votes_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await run_in_threadpool(Base.metadata.create_all, engine)
    try:
        yield
    finally:
        await run_in_threadpool(engine.dispose)


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(ApplicationError)
async def application_error_handler(request: Request, error: ApplicationError) -> JSONResponse:
    return JSONResponse(status_code=error.status_code, content={"detail": error.detail})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, error: RequestValidationError) -> JSONResponse:
    details = [
        {"loc": item["loc"], "msg": item["msg"], "type": item["type"]}
        for item in error.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": details})


@app.exception_handler(OperationalError)
async def database_error_handler(request: Request, error: OperationalError) -> JSONResponse:
    logger.error("Database unavailable (%s)", type(error.orig).__name__)
    return JSONResponse(status_code=503, content={"detail": "База данных временно недоступна"})


app.include_router(polls_router)
app.include_router(votes_router)
app.include_router(user_router)