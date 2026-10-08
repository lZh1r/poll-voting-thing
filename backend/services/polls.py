from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from backend.errors import ConflictError, NotFoundError
from backend.models import Poll, PollOption, PollStatus, Vote
from backend.schemas import PollCreate, PollInternalStatus, PollOptionStatus, PollPreview, PollUpdate
from backend.services.users import get_user


def get_poll(session: Session, poll_id: UUID, *, lock: bool = False) -> Poll:
    query = select(Poll).where(Poll.id == poll_id).options(selectinload(Poll.options))
    if lock:
        query = query.with_for_update()
    poll = session.scalar(query)
    if poll is None:
        raise NotFoundError("Опрос не найден")
    return poll


def poll_preview(poll: Poll, total_votes: int) -> PollPreview:
    return PollPreview(
        id=poll.id,
        owner_id=poll.owner_id,
        title=poll.title,
        description=poll.description,
        status=poll.status,
        total_votes=total_votes,
        created_at=poll.created_at,
    )


def list_polls(
    session: Session, owner_id: UUID | None, offset: int, limit: int
) -> list[PollPreview]:
    if owner_id is not None:
        _ = get_user(session, owner_id)
    totals = (
        select(PollOption.poll_id, func.count(Vote.id).label("total_votes"))
        .join(Vote, Vote.option_id == PollOption.id)
        .group_by(PollOption.poll_id)
        .subquery()
    )
    query = select(Poll, func.coalesce(totals.c.total_votes, 0)).outerjoin(
        totals, totals.c.poll_id == Poll.id
    )
    if owner_id is not None:
        query = query.where(Poll.owner_id == owner_id)
    query = query.order_by(Poll.created_at.desc(), Poll.id).offset(offset).limit(limit)
    return [poll_preview(poll, total) for poll, total in session.execute(query)]


def poll_details(session: Session, poll: Poll) -> PollInternalStatus:
    counts: dict[UUID, int] = {
        option_id: total_votes
        for option_id, total_votes in session.execute(
            select(PollOption.id, func.count(Vote.id))
            .outerjoin(Vote, Vote.option_id == PollOption.id)
            .where(PollOption.poll_id == poll.id)
            .group_by(PollOption.id)
        )
    }
    preview = poll_preview(poll, sum(counts.values()))
    return PollInternalStatus(
        **preview.model_dump(),
        options=[
            PollOptionStatus(id=option.id, text=option.text, votes=counts.get(option.id, 0))
            for option in poll.options
        ],
    )


def create_poll(session: Session, data: PollCreate) -> PollInternalStatus:
    _ = get_user(session, data.owner_id)
    poll = Poll(
        owner_id=data.owner_id,
        title=data.title,
        description=data.description,
        options=[
            PollOption(text=text, position=position)
            for position, text in enumerate(data.options)
        ],
    )
    session.add(poll)
    session.flush()
    return poll_details(session, poll)


def update_poll(session: Session, poll_id: UUID, data: PollUpdate) -> PollInternalStatus:
    poll = get_poll(session, poll_id, lock=True)
    if data.owner_id is not None:
        _ = get_user(session, data.owner_id)
    if poll.status == PollStatus.finished and data.status not in {None, PollStatus.finished}:
        raise ConflictError("Завершённый опрос нельзя возобновить")
    for field, value in data.model_dump(exclude_unset=True, exclude={"options"}).items():
        setattr(poll, field, value)
    if data.options is not None:
        existing_options = list(poll.options)
        for position, text in enumerate(data.options):
            if position < len(existing_options):
                existing_options[position].text = text
            else:
                poll.options.append(PollOption(text=text, position=position))
        for option in existing_options[len(data.options):]:
            poll.options.remove(option)
    session.flush()
    return poll_details(session, poll)


def delete_poll(session: Session, poll_id: UUID) -> None:
    session.delete(get_poll(session, poll_id, lock=True))
    session.flush()
