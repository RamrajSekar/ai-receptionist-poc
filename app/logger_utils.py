from app.database import logs_collection
from datetime import datetime,timezone
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def log_to_db(level: str,phone:str, message: str, context: Optional[dict] = None):
    # Save log entry into MongoDB
    try:
        log_entry = {
            "phone":phone,
            "level":level.upper(),
            "message":message,
            "context": context or {},
            "timestamp": datetime.now(timezone.utc)
        }
        logs_collection.insert_one(log_entry)
        logger.debug(f"Logged to MongoDB: {message}")
    except Exception as e:
        logger.error(f"Error occured while saving log to MongoDB: {str(e)}")