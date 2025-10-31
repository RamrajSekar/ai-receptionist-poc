from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta,timezone 
from jose import JWTError, jwt
from app.database import users_collection
from app.secure_app import hash_password, verify_password, create_access_token
from app.db_user_utils import create_user, find_user_by_email, verify_user, update_user_twilio, update_user_availability
from pydantic import BaseModel, EmailStr
import os, logging
from app.models import Token
from bson import ObjectId
from app.dependencies.auth_dep import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

# Signup Model
class SignupRequest(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(user: SignupRequest):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "hashed_password": hashed_pw,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
    }
    users_collection.insert_one(new_user)
    return {"message": "Signup successful"}

@router.post("/login", response_model=Token)
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

   
@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {
        "_id": user["_id"],
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "email": user["email"],
        "is_active": user["is_active"],
        "twilio_phone": user.get("twilio_phone"),
        "created_at": user["created_at"],
    }

@router.post("/{user_id}")
def setAvailability(available: bool ,available_from: datetime ,available_to: datetime, user: dict = Depends(get_current_user),):
    try:
        input_data = {"available": available,"available_from":available_from,"available_to":available_to}
        modified_count = update_user_availability(user["_id"],input_data)
        if modified_count==0:
            raise HTTPException(status_code=400, detail=f"User {user["_id"]} Not Found ")
        logger.info(f"Updated User Availability {user["_id"]} → {available}")
        return {"message": f"Updated User Availability {user["_id"]} → {available}"}
    except Exception as e:
        logger.error(f"Error Updating User: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")