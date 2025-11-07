from fastapi import APIRouter, Depends, HTTPException
from app.dependencies.auth_dep import get_current_user
from app.database import users_collection
from app.utils import encrypt_value, decrypt_value
from bson import ObjectId

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/")
async def get_settings(user=Depends(get_current_user)):
    db_user = users_collection.find_one({"_id": ObjectId(user["_id"])})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "twilio_sid": bool(db_user.get("twilio_sid")),
        "twilio_auth_token": bool(db_user.get("twilio_auth_token")),
        "twilio_phone": db_user.get("twilio_phone"),
        "openai_api_key": bool(db_user.get("openai_api_key")),
        "sendgrid_api_key": bool(db_user.get("sendgrid_api_key")),
    }

@router.put("/")
async def update_settings(payload: dict, user=Depends(get_current_user)):
    encrypted_data = {
        "twilio_sid": encrypt_value(payload.get("twilio_sid")),
        "twilio_auth_token": encrypt_value(payload.get("twilio_auth_token")),
        "twilio_phone": payload.get("twilio_phone"),
        "openai_api_key": encrypt_value(payload.get("openai_api_key")),
        "sendgrid_api_key": encrypt_value(payload.get("sendgrid_api_key")),
    }
    users_collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": encrypted_data}
    )
    return {"message": "Settings updated successfully"}
