from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id=Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    status = Column(String, default="pending")
    datetime = Column(DateTime, nullable=False)
