from uuid import UUID

from fastapi import APIRouter

from backend.schemas import PublicPollStatus, VoteRequest


votes_router = APIRouter(prefix="/api/votes")

@votes_router.post("/{poll_id}")
def vote(poll_id: UUID, data: VoteRequest):
    pass

@votes_router.get("/{poll_id}")
def get_public_poll_status(poll_id: UUID) -> PublicPollStatus:
    pass