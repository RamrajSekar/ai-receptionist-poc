from fastapi import APIRouter, Depends, HTTPException
from app.models import AppointmentCreate, AppointmentResponse
from app.database import appointments_collection
from pymongo.errors import DuplicateKeyError
from datetime import datetime
from app import db_utils
import logging
from bson.errors import InvalidId

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

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/",response_model=AppointmentResponse)
def create_booking(appointment: AppointmentCreate):
    try:
        # existing = appointments_collection.find_one({"phone": appointment.phone})
        # if existing:
        #     raise HTTPException(status_code=400, detail="Phone number already exists")
        # elif len(appointment.phone)!= 10:
        #     raise HTTPException(status_code=400, detail="Invalid Phone Number")
        if not appointment.phone.isdigit() or len(appointment.phone) != 10:
            raise HTTPException(status_code=400, detail="Invalid phone number. Must be 10 digits.")
        
        appointment_dict = appointment.model_dump()
        appointment_dict["status"] = "Pending"
        
        inserted_id = db_utils.create_appointment(appointment_dict)
        appointment_dict["id"] = inserted_id
        logger.info(f"Created booking for {appointment.phone}")
        return appointment_dict
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Phone number already exists")
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Phone number/Number already exists")


@router.get("/",response_model=list[AppointmentResponse])
def get_bookings():
    try:
        bookings = db_utils.list_appointments()
        response = []
        for booking in bookings:
            response.append({
                    "id":str(booking["_id"]),
                    "name":booking.get("name",""),
                    "phone":booking.get("phone",""),
                    "status":booking.get("status",""),
                    "datetime":(
                        booking["datetime"].isoformat()
                        if isinstance(booking.get("datetime"), datetime)
                        else booking.get("datetime")
                    ),
                })
        logger.info(f"Retrieved {len(response)} bookings")
        return response
    except Exception as e:
        logger.error(f"Unexpected error while fetching bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/{appointment_id}",response_model=dict)
def update_booking_status(appointment_id: str, status: str):
    """
    Update the status of an appointment.
    Allowed statuses: confirmed, cancelled, pending
    """
    try:
        allowed_status = {"Confirmed","Cancelled","Pending"}

        if status not in allowed_status:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {allowed_status}")
        
        modified_count = db_utils.update_appointment_status(appointment_id, status)
        if modified_count==0:
            raise HTTPException(status_code=400, detail=f"Appointment {appointment_id} Not Found ")
        logger.info(f"Updated booking {appointment_id} → {status}")
        return {"message": f"Appointment {appointment_id} updated to {status}"}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
    except Exception as e:
        logger.error(f"Error Updating Appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{phone}",response_model=dict)
def delete_appointment(phone: str):
    try:
        result = db_utils.delete_appointment_by_phone(phone)
        if result==0:
            raise HTTPException(status_code=400, detail=f"Appointment By {phone} Not Found ")
        
        logger.info(f"Deleted booking for {phone}")
        return {"message": f"Appointment for {phone} is deleted !!!"}
    except ValueError as ve:
        logger.warning(str(ve))
        raise HTTPException(status_code=409, detail=str(ve))
    except Exception as e:
        logger.error(f"Error Deleting Appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")