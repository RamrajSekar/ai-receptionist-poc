from fastapi import APIRouter, Depends, HTTPException
from app.models import AppointmentCreate, AppointmentResponse
from app.database import appointments_collection
from pymongo.errors import DuplicateKeyError
from datetime import datetime
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/",response_model=AppointmentResponse)
def create_booking(appointment: AppointmentCreate):
    try:
        existing = appointments_collection.find_one({"phone": appointment.phone})
        if existing:
            raise HTTPException(status_code=400, detail="Phone number already exists")
        elif len(appointment.phone)!= 10:
            raise HTTPException(status_code=400, detail="Invalid Phone Number")
        appointment_dict = appointment.model_dump()
        result = appointments_collection.insert_one(appointment_dict)
        appointment_dict["id"] = str(result.inserted_id)
        logger.info(f"Created booking for {appointment.phone}")
        return appointment_dict
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Phone number/Number already exists")


@router.get("/",response_model=list[AppointmentResponse])
def get_bookings():
    try:
        bookings = list(appointments_collection.find())
        response = [
            {
                "id": str(booking["_id"]),  # Convert ObjectId to string
                "name": booking["name"],
                "phone": booking["phone"],
                "status": booking["status"],
                "datetime": booking["datetime"]
            }
            for booking in bookings
        ]
        logger.info(f"Retrieved {len(response)} bookings")
        return response
    except KeyError as e:
        logger.error(f"Missing field in document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Invalid document structure: missing {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Below is for SQLITE
# @router.get("/")
# def get_bookings(db: Session=Depends(get_db)):
#     try:
#         bookings = db.query(Appointment).all()
#         logger.info(f"Retrieved {len(bookings)} bookings")
#         if not bookings:
#             return {"message": "No appointments found", "data": []}
#         return bookings
#     except OperationalError as e:
#         logger.error(f"Database error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")