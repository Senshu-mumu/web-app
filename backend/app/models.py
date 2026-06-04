# app/models.py
from datetime import datetime, date
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    google_sub: str = Field(index=True, unique=True)  # OIDC "sub"
    email: Optional[str] = Field(default=None, index=True)
    full_name: Optional[str] = None
    picture: Optional[str] = None

    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    task_name: str
    tag: Optional[str] = None
    detail_task: Optional[str] = None

    priority: str = "中"
    deadline: Optional[date] = None
    achievement: bool = False

    owner_id: int = Field(index=True, foreign_key="user.id")
