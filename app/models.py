from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone

class AppointmentCreate(BaseModel):
    name: str
    phone: str
    status: Optional[str] = "Pending"
    datetime: str
    intent: Optional[str] = None
    transcript: Optional[str] = None
    stage: Optional[str] = "initial"
    owner_id: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str  # MongoDB uses _id (ObjectId) as string
    name: str
    phone: str
    datetime: str
    intent: str
    status: str
    transcript: str
    stage: str
    owner_id: Optional[str] = None 
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserIn(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str = Field(alias="_id")
    firstname: str
    lastname: str
    email: EmailStr
    is_active: bool
    twilio_phone: Optional[str] = None
    created_at: datetime
    available: Optional[bool] = True
    available_from: Optional[datetime] = None
    availble_to: Optional[datetime] = None
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }

class UserDB(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    firstname: str
    lastname: str
    email: EmailStr
    hashed_password: Optional[str]
    is_active: bool = True
    oauth_provider: Optional[str] = None
    picture: Optional[str] = None
    twilio_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_phone: Optional[str] = None
    is_twilio_verified: Optional[bool] = False
    openai_api_key: Optional[str] = None
    sendgrid_api_key: Optional[str] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ✅ Global encoder so ObjectId → str automatically everywhere
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)  # always convert to string

class BaseMongoModel(BaseModel):
    class Config:
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
        populate_by_name = True