# app/schemas.py
from __future__ import annotations
from datetime import date, datetime
from typing import Optional, Literal
from sqlmodel import SQLModel

# Task
PriorityLiteral = Literal["低", "中", "高", "重要", "最重要"]

class TaskBase(SQLModel):
    task_name: str
    tag: Optional[str] = None
    detail_task: Optional[str] = None
    priority: PriorityLiteral
    deadline: Optional[date] = None
    achievement: bool = False

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int

class TaskUpdate(SQLModel):
    task_name: Optional[str] = None
    tag: Optional[str] = None
    detail_task: Optional[str] = None
    priority: Optional[PriorityLiteral] = None
    deadline: Optional[date] = None
    achievement: Optional[bool] = None

# User
class UserRead(SQLModel):
    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool
    created_at: datetime
