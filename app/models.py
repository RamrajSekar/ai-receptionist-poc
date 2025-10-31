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
    available: bool
    available_from: datetime
    availble_to: datetime

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
    is_twilio_verified: bool = False
    available: bool
    available_from: datetime
    availble_to: datetime
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"