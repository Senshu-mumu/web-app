# app/crud.py
from typing import Iterable, Optional
from sqlmodel import select, Session

from .models import Task
from .schemas import TaskCreate, TaskUpdate


def create_task(session: Session, data: TaskCreate, owner_id: int) -> Task:
    obj = Task(**data.model_dump(), owner_id=owner_id)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


def get_task(session: Session, task_id: int, owner_id: int) -> Optional[Task]:
    stmt = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    return session.exec(stmt).first()


def list_tasks(
    session: Session,
    *,
    owner_id: int,
    priority: Optional[str] = None,
    achieved: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
) -> Iterable[Task]:
    stmt = select(Task).where(Task.owner_id == owner_id).order_by(Task.id.desc())
    if priority is not None:
        stmt = stmt.where(Task.priority == priority)
    if achieved is not None:
        stmt = stmt.where(Task.achievement == achieved)
    stmt = stmt.limit(limit).offset(offset)
    return list(session.exec(stmt))


def update_task(session: Session, task_id: int, data: TaskUpdate, owner_id: int) -> Optional[Task]:
    obj = get_task(session, task_id, owner_id)
    if not obj:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(obj, k, v)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


def delete_task(session: Session, task_id: int, owner_id: int) -> bool:
    obj = get_task(session, task_id, owner_id)
    if not obj:
        return False
    session.delete(obj)
    session.commit()
    return True


def set_task_achievement(session: Session, task_id: int, achievement: bool, owner_id: int) -> bool:
    obj = get_task(session, task_id, owner_id)
    if not obj:
        return False
    obj.achievement = achievement
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return True
