# from sqlalchemy import Column, Integer, String, DateTime
# from app.database import Base

# class Appointment(Base):
#     __tablename__ = "appointments"

#     id=Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     phone = Column(String, nullable=True)
#     status = Column(String, default="pending")
#     datetime = Column(DateTime, nullable=False)


from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    name: str
    phone: str
    status: Optional[str] = "Pending"
    datetime: str 

class AppointmentResponse(BaseModel):
    id: str  # MongoDB uses _id (ObjectId) as string
    name: str
    phone: str
    status: str
    datetime: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}