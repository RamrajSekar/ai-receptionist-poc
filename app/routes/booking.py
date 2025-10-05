from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import Appointment
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_booking(name: str,phone: str,date_time_str: str,db: Session = Depends(get_db)):
    appointment = Appointment(
        name=name,
        phone=phone,
        datetime=datetime.fromisoformat(date_time_str)
    )
    if db.query(Appointment).filter(Appointment.phone == appointment.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already exists")
    elif len(phone)!= 10:
        raise HTTPException(status_code=400, detail="Invalid Phone Number")
    try:
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        return {"message" : "Appointment Booked","Appointment_Id":appointment.id}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid Phone number/Number already exists")

@router.get("/")
def get_bookings(db: Session=Depends(get_db)):
    bookings = db.query(Appointment).all()
    if not bookings:
        return {"message": "No appointments found", "data": []}
    return bookings