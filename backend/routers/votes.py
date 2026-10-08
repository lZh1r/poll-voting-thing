from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from backend.database import DatabaseSession
from backend.schemas import PublicPollStatus, VoteData, VoteRequest
from backend.services import polls, votes

votes_router = APIRouter(prefix="/api/votes", tags=["Votes"])


@votes_router.get("")
def list_votes(
    poll_id: UUID,
    session: DatabaseSession,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[VoteData]:
    return votes.list_votes(session, poll_id, offset, limit)


@votes_router.post("/{poll_id}", status_code=status.HTTP_201_CREATED)
def vote(poll_id: UUID, data: VoteRequest, session: DatabaseSession) -> VoteData:
    return votes.create_vote(session, poll_id, data)


@votes_router.get("/{poll_id}")
def get_public_poll_status(poll_id: UUID, session: DatabaseSession) -> PublicPollStatus:
    return PublicPollStatus.model_validate(polls.get_poll(session, poll_id))


@votes_router.get("/{poll_id}/{vote_id}")
def get_vote(poll_id: UUID, vote_id: UUID, session: DatabaseSession) -> VoteData:
    polls.get_poll(session, poll_id)
    return votes.vote_data(votes.get_vote(session, poll_id, vote_id), poll_id)


@votes_router.patch("/{poll_id}/{vote_id}")
def update_vote(
    poll_id: UUID, vote_id: UUID, data: VoteRequest, session: DatabaseSession
) -> VoteData:
    return votes.update_vote(session, poll_id, vote_id, data)


@votes_router.delete("/{poll_id}/{vote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vote(poll_id: UUID, vote_id: UUID, session: DatabaseSession) -> Response:
    votes.delete_vote(session, poll_id, vote_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
