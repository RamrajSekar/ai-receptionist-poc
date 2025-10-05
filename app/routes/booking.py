from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, OperationalError
from app.database import get_db
from app.models import Appointment
from datetime import datetime
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    except IntegrityError as e:
        logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid Phone number/Number already exists")

@router.get("/")
def get_bookings(db: Session=Depends(get_db)):
    try:
        bookings = db.query(Appointment).all()
        logger.info(f"Retrieved {len(bookings)} bookings")
        if not bookings:
            return {"message": "No appointments found", "data": []}
        return bookings
    except OperationalError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")