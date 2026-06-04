# app/api/routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from sqlmodel import Session, delete
from pydantic import BaseModel
from fastapi.responses import Response, JSONResponse

from ..database import get_session
from ..schemas import (
    TaskCreate, TaskRead, TaskUpdate, PriorityLiteral,
    UserRead,
)
from ..models import User, Task
from .. import crud
from ..auth import get_current_user
from ..oauth_google import COOKIE_SECURE  

router = APIRouter()

@router.get("/users/me", response_model=UserRead, tags=["users"])
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.delete("/users/me", status_code=204, tags=["users"])
def delete_me(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    OAuthのみ運用のため「パスワード再入力」はできない。
    ログイン中の本人が削除する（フロント側で2段階確認推奨）。
    """
    try:
        session.exec(delete(Task).where(Task.owner_id == current_user.id))
        session.delete(current_user)
        session.commit()
    except Exception:
        session.rollback()
        raise
    return None


from fastapi import Response

@router.post("/auth/logout", status_code=204, tags=["auth"])
@router.post("/auth/logout/", status_code=204, tags=["auth"])
def logout():
    resp = Response(status_code=204)

    def kill(name: str, domain: str | None):
        resp.set_cookie(
            key=name,
            value="",
            max_age=0,
            expires=0,
            path="/",
            domain=domain,
            secure=COOKIE_SECURE,
            httponly=True,
            samesite="lax",
        )

    for d in (None, "api.mumusen-net.com", ".mumusen-net.com"):
        kill("access_token", d)
        kill("session", d)

    return resp

tasks = APIRouter(prefix="/tasks", tags=["tasks"])


@tasks.post("", response_model=TaskRead)
def create_task(
    payload: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return crud.create_task(session, payload, owner_id=current_user.id)


@tasks.get("", response_model=List[TaskRead])
def list_tasks(
    priority: Optional[PriorityLiteral] = Query(None, description="優先度で絞り込み"),
    achieved: Optional[bool] = Query(None, description="達成状況で絞り込み"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return list(
        crud.list_tasks(
            session,
            owner_id=current_user.id,
            priority=priority,
            achieved=achieved,
            limit=limit,
            offset=offset,
        )
    )


@tasks.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    obj = crud.get_task(session, task_id, owner_id=current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    return obj


@tasks.patch("/{task_id}", response_model=TaskRead)
def patch_task(
    task_id: int,
    payload: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    obj = crud.update_task(session, task_id, payload, owner_id=current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    return obj


@tasks.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    ok = crud.delete_task(session, task_id, owner_id=current_user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Task not found")
    return None


class AchievementUpdate(BaseModel):
    achievement: bool


@tasks.patch("/{task_id}/achievement", status_code=204)
def update_achievement(
    task_id: int,
    payload: AchievementUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    ok = crud.set_task_achievement(session, task_id, payload.achievement, owner_id=current_user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Task not found")
    return None


router.include_router(tasks)
