# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .database import create_db_and_tables
from .oauth_google import router as oauth_router
from .api.routes import router as api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://todo.mumusen-net.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authlib の state/nonce 用
app.add_middleware(SessionMiddleware, secret_key=os.environ["JWT_SECRET"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(oauth_router)
app.include_router(api_router)

@app.get("/health")
def health():
    return {"ok": True}
