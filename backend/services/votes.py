from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.errors import ConflictError, NotFoundError
from backend.models import Poll, PollOption, PollStatus, Vote
from backend.schemas import VoteData, VoteRequest
from backend.services.polls import get_poll


def vote_data(vote: Vote, poll_id: UUID) -> VoteData:
    return VoteData(
        id=vote.id,
        poll_id=poll_id,
        option_id=vote.option_id,
        created_at=vote.created_at,
    )


def get_vote(session: Session, poll_id: UUID, vote_id: UUID) -> Vote:
    vote = session.scalar(
        select(Vote)
        .join(PollOption, Vote.option_id == PollOption.id)
        .where(Vote.id == vote_id, PollOption.poll_id == poll_id)
    )
    if vote is None:
        raise NotFoundError("Голос в этом опросе не найден")
    return vote


def list_votes(
    session: Session, poll_id: UUID, offset: int, limit: int
) -> list[VoteData]:
    get_poll(session, poll_id)
    query = (
        select(Vote)
        .join(PollOption, Vote.option_id == PollOption.id)
        .where(PollOption.poll_id == poll_id)
        .order_by(Vote.created_at.desc(), Vote.id)
        .offset(offset)
        .limit(limit)
    )
    return [vote_data(vote, poll_id) for vote in session.scalars(query)]


def validate_option(poll: Poll, option_id: UUID) -> None:
    if not any(option.id == option_id for option in poll.options):
        raise NotFoundError("Вариант ответа в этом опросе не найден")
    if poll.status != PollStatus.active:
        raise ConflictError("Опрос не принимает голоса: он приостановлен или завершён")


def create_vote(session: Session, poll_id: UUID, data: VoteRequest) -> VoteData:
    poll = get_poll(session, poll_id, lock=True)
    validate_option(poll, data.option_id)
    vote = Vote(option_id=data.option_id)
    session.add(vote)
    session.flush()
    return vote_data(vote, poll_id)


def update_vote(
    session: Session, poll_id: UUID, vote_id: UUID, data: VoteRequest
) -> VoteData:
    poll = get_poll(session, poll_id, lock=True)
    vote = get_vote(session, poll_id, vote_id)
    validate_option(poll, data.option_id)
    vote.option_id = data.option_id
    session.flush()
    return vote_data(vote, poll_id)


def delete_vote(session: Session, poll_id: UUID, vote_id: UUID) -> None:
    get_poll(session, poll_id, lock=True)
    session.delete(get_vote(session, poll_id, vote_id))
    session.flush()
