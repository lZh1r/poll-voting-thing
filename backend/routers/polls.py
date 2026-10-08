from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from backend.database import DatabaseSession
from backend.schemas import PollCreate, PollInternalStatus, PollPreview, PollUpdate
from backend.services import polls

polls_router = APIRouter(prefix="/api/polls", tags=["Polls"])


@polls_router.get("")
def list_polls(
    session: DatabaseSession,
    owner_id: UUID | None = None,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[PollPreview]:
    return polls.list_polls(session, owner_id, offset, limit)


@polls_router.get("/{poll_id}")
def get_poll_details(poll_id: UUID, session: DatabaseSession) -> PollInternalStatus:
    return polls.poll_details(session, polls.get_poll(session, poll_id))


@polls_router.post("", status_code=status.HTTP_201_CREATED)
def create_poll(data: PollCreate, session: DatabaseSession) -> PollInternalStatus:
    return polls.create_poll(session, data)


@polls_router.patch("/{poll_id}")
def edit_poll(
    poll_id: UUID, data: PollUpdate, session: DatabaseSession
) -> PollInternalStatus:
    return polls.update_poll(session, poll_id, data)


@polls_router.delete("/{poll_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_poll(poll_id: UUID, session: DatabaseSession) -> Response:
    polls.delete_poll(session, poll_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
