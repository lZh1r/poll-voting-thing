import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import inspect, text
from sqlalchemy.exc import OperationalError
from starlette.concurrency import run_in_threadpool

from backend.config import settings
from backend.database import Base, engine
from backend.errors import ApplicationError
from backend.routers.auth import auth_router
from backend.routers.polls import polls_router
from backend.routers.users import user_router
from backend.routers.votes import votes_router

logger = logging.getLogger(__name__)


def prepare_database() -> None:
    if inspect(engine).has_table("users"):
        with engine.begin() as connection:
            _ = connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"))
    Base.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await run_in_threadpool(prepare_database)
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
    allow_credentials=True,
)


@app.middleware("http")
async def check_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin and request.method in {"POST", "PATCH", "DELETE"}:
        scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
        same_origin = f"{scheme}://{request.headers.get('host')}"
        if origin != same_origin and origin not in settings.cors_origins:
            return JSONResponse(status_code=403, content={"detail": "Недопустимый источник запроса"})
    return await call_next(request)


@app.exception_handler(ApplicationError)
async def application_error_handler(request: Request, error: ApplicationError) -> JSONResponse:
    content = {"detail": error.detail}
    if hasattr(error, "code"):
        content["code"] = error.code
    return JSONResponse(status_code=error.status_code, content=content)


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
app.include_router(auth_router)
