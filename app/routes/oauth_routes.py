from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from app.database import users_collection
from app.secure_app import create_access_token  # existing JWT helper
from bson import ObjectId
from datetime import datetime, timezone
from cryptography.fernet import Fernet
import os, logging

router = APIRouter(prefix="/oauth", tags=["OAuth"])

oauth = OAuth()

fernet = Fernet(os.getenv("TOKEN_ENCRYPTION_KEY"))
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173/dashboard")

# Google
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope":    (
            "openid email profile "
            "https://www.googleapis.com/auth/userinfo.email "
            "https://www.googleapis.com/auth/userinfo.profile "
            "https://www.googleapis.com/auth/gmail.readonly "
            "https://www.googleapis.com/auth/gmail.send"),
            "access_type": "offline",
            "prompt": "consent"
        },
        
)

@router.get("/login/{provider}")
async def oauth_login(request: Request, provider: str):
    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(status_code=404, detail="Unsupported provider")
    redirect_uri = os.getenv("OAUTH_REDIRECT_URL")
    return await client.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def oauth_callback(request: Request):
    try:
        client = None
        # provider_name = "google"  # Extendable for multi-provider
        # client = oauth.create_client(provider_name)
        
        if "google" in str(request.url):
            provider_name = "google"
        elif "microsoft" in str(request.url):
            provider_name = "microsoft"
        client = oauth.create_client(provider_name)

        # Exchange auth code for token
        token = await client.authorize_access_token(request)
        user_info = token.get("userinfo") or await client.parse_id_token(request, token)

        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to fetch user info")

        user = users_collection.find_one({"email": user_info["email"]})
        if user:
            user_id = user["_id"]
        else:
            # Create New User
            new_user = {
                "firstname": user_info.get("given_name", ""),
                "lastname": user_info.get("family_name", ""),
                "email": user_info["email"],
                "oauth_provider": provider_name,
                "is_active": True,
                "created_at": datetime.now(timezone.utc),
            }
            result = users_collection.insert_one(new_user)
            user_id = result.inserted_id

        # Generate JWT token
        token = create_access_token({"sub": str(user_id), "email": user_info["email"]})
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        redirect_url = f"{frontend_url}/?token={token}"
        response = RedirectResponse(redirect_url)
        return response
    except Exception as e:
        print(f"OAuth callback error: {e}")
        raise HTTPException(status_code=500, detail="OAuth processing failed")
