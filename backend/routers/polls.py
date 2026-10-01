from fastapi import APIRouter

from ..schemas import PollInternalStatus

polls_router = APIRouter(prefix="/api/polls")

@polls_router.get("")
def list_polls() -> list[PollInternalStatus]:
    return []