from app.database import users_collection
from app.models import UserDB
from bson import ObjectId
from passlib.hash import bcrypt
from app.secure_app import hash_password, verify_password
from datetime import datetime, timezone
from typing import Optional

def _to_str_id(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc

def create_user(user_input_data: dict) -> str:
    doc = {
        "firstname": user_input_data["firstname"],
        "lastname": user_input_data["lastname"],
        "email": user_input_data["email"].lower(),
        "hashed_password": hash_password(user_input_data["password"]),
        "is_active": True,
        "oauth_provider": None,
        "picture": None,
        "twilio_sid": None,
        "twilio_auth_token": None,
        "twilio_phone": None,
        "is_twilio_verified": False,
        "created_at": datetime.now(timezone.utc),
    }
    res = users_collection.insert_one(doc)
    return str(res.inserted_id)

def find_user_by_email(email: str) -> Optional[dict]:
    doc = users_collection.find_one({'email': email.lower()})
    return _to_str_id(doc)

def verify_user(email: str, password: str) -> Optional[dict]:
    doc = find_user_by_email(email)
    if not doc:
        return None
    if not verify_password(password, doc.get("hashed_password", "")):
        return None
    return _to_str_id(doc)

def update_user_twilio(email: str, twilio_data: dict):
    users_collection.update_one(
        {'email': email},
        {"$set": twilio_data}
    )

def update_user_availability(owner_id: str,user_data: dict):
    """Update User Availability"""
    result = users_collection.update_one(
        {"_id": ObjectId(owner_id)},
        {"$set": user_data}
    )
    return result.modified_count