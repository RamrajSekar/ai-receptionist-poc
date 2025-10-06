from bson.objectid import ObjectId
from .database import appointments_collection
from pymongo.errors import DuplicateKeyError

def create_appointment(data):
    try:
        result = appointments_collection.insert_one(data)
        return str(result.inserted_id)
    except DuplicateKeyError as e:
        raise e

def get_appointment_by_phone(phone):
    return str(appointments_collection.find_one({"phone": phone}))

def list_appointments():
    return list(appointments_collection.find())

def delete_appointment(appointment_id):
    return appointments_collection.delete_one({"_id": ObjectId(appointment_id)})

def delete_appointment_by_phone(phone: str):
    """Delete appointment by phone number with safeguard for duplicates"""
    matches = list(appointments_collection.find({"phone": phone}))

    if len(matches) == 0:
        return 0  # nothing to delete
    elif len(matches) > 1:
        raise ValueError(f"Multiple appointments found with phone {phone}. Aborting delete.")

    # safe to delete
    result = appointments_collection.delete_one({"phone": phone})
    return result.deleted_count

def update_appointment_status(appointment_id: str, status: str):
    """Update appointment status"""
    result = appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": status}}
    )
    return result.modified_count