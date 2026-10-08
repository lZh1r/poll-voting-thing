from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from backend.config import settings
from backend.errors import ConflictError


class Base(DeclarativeBase):
    pass

engine = create_engine(settings.sqlalchemy_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_session() -> Iterator[Session]:
    with SessionLocal() as session:
        try:
            with session.begin():
                yield session
        except IntegrityError as error:
            raise ConflictError(
                "data conflict happened"
            ) from error


DatabaseSession = Annotated[Session, Depends(get_session, scope="function")]
