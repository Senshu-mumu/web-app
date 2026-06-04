# # app/oauth_google.py
import os
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .database import get_session
from .models import User
from .security import create_access_token

router = APIRouter()

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN")
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"

oauth = OAuth()
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_id=os.environ["GOOGLE_CLIENT_ID"],
    client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
    client_kwargs={"scope": "openid email profile"},
)

@router.get("/auth/google/login")
async def google_login(request: Request):
    redirect_uri = os.environ["GOOGLE_REDIRECT_URI"]
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(
    request: Request,
    session: Session = Depends(get_session),
):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError:
        return RedirectResponse(f"{FRONTEND_ORIGIN}/login?error=oauth")

    userinfo = token.get("userinfo")
    if not userinfo:
        userinfo = await oauth.google.userinfo(token=token)

    google_sub = userinfo["sub"]
    email = userinfo.get("email")
    name = userinfo.get("name")
    picture = userinfo.get("picture")

    user = session.exec(select(User).where(User.google_sub == google_sub)).first()
    if not user:
        user = User(
            google_sub=google_sub,
            email=email,
            full_name=name,
            picture=picture,
            is_active=True,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    else:
        user.email = email
        user.full_name = name
        user.picture = picture
        session.add(user)
        session.commit()
        session.refresh(user)

    app_jwt = create_access_token(user.id)
    resp = RedirectResponse(f"{FRONTEND_ORIGIN}/task")
    resp.set_cookie(
        "access_token",
        app_jwt,
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        domain=".mumusen-net.com",   # ← 追加（最重要）
        path="/",
        max_age=60 * 60 * 12,
    )
    return resp

@router.post("/auth/logout")
def logout():
    resp = RedirectResponse(f"{FRONTEND_ORIGIN}/")
    resp.delete_cookie("access_token", path="/")
    return resp
