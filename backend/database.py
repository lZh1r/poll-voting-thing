from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


class Base(DeclarativeBase):
    pass

database_url = "postgresql+psycopg://postgres:postgres@localhost:5432/polls"
engine = create_engine(database_url)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
