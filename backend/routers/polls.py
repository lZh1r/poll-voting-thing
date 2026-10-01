from uuid import UUID

from fastapi import APIRouter

from ..schemas import PollCreate, PollInternalStatus, PollPreview, PollUpdate

polls_router = APIRouter(prefix="/api/polls")

@polls_router.get("")
def list_polls() -> list[PollPreview]:
    pass
    
@polls_router.get("/{poll_id}")
def get_poll_details(poll_id: UUID) -> PollInternalStatus:
    pass

@polls_router.post("")
def create_poll(data: PollCreate) -> PollPreview:
    pass
    
@polls_router.patch("/{poll_id}")
def edit_poll(poll_id: UUID, data: PollUpdate) -> PollPreview:
    pass
    
@polls_router.delete("/{poll_id}")
def delete_poll(poll_id: UUID):
    pass