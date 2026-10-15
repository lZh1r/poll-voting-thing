from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from backend.database import DatabaseSession
from backend.schemas import PollCreate, PollInternalStatus, PollPreview, PollUpdate
from backend.services import polls
from backend.services.auth import CurrentUser

polls_router = APIRouter(prefix="/api/polls", tags=["Polls"])


@polls_router.get("")
def list_polls(
    session: DatabaseSession,
    user: CurrentUser,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[PollPreview]:
    return polls.list_polls(session, user.id, offset, limit)


@polls_router.get("/{poll_id}")
def get_poll_details(poll_id: UUID, session: DatabaseSession, user: CurrentUser) -> PollInternalStatus:
    poll = polls.get_poll(session, poll_id)
    polls.ensure_owner(poll, user)
    return polls.poll_details(session, poll)


@polls_router.post("", status_code=status.HTTP_201_CREATED)
def create_poll(data: PollCreate, session: DatabaseSession, user: CurrentUser) -> PollInternalStatus:
    return polls.create_poll(session, data, user)


@polls_router.patch("/{poll_id}")
def edit_poll(
    poll_id: UUID, data: PollUpdate, session: DatabaseSession, user: CurrentUser
) -> PollInternalStatus:
    return polls.update_poll(session, poll_id, data, user)


@polls_router.delete("/{poll_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_poll(poll_id: UUID, session: DatabaseSession, user: CurrentUser) -> Response:
    polls.delete_poll(session, poll_id, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
