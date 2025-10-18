import os
from pymongo import MongoClient, ASCENDING
import logging
from dotenv import load_dotenv

# Load .env file
load_dotenv("app\\.env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



MONGODB_URL = os.getenv("MONGODB_URL")
# Log only the host part to avoid exposing credentials
log_url = MONGODB_URL.split("@")[1] if "@" in MONGODB_URL else MONGODB_URL
logger.info(f"Connecting to MongoDB: {log_url}")

try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')  # Test connection
    logger.info("MongoDB connection successful")
except Exception as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise

db = client.receptionist_poc
appointments_collection = db.appointments
logs_collection = db.logs

def ensure_indexes():
    try:
        indexes = appointments_collection.index_information()
        # Drop old unique index if found
        if "phone_1" in indexes and indexes["phone_1"].get("unique"):
            logger.info("Dropping old unique phone index...")
            appointments_collection.drop_index("phone_1")
        appointments_collection.create_index(
            [("phone", ASCENDING), ("datetime", ASCENDING)],
            unique=False,
            name="phone_datetime_index"
        )
        # appointments_collection.create_index([("phone", 1), ("datetime", 1)], unique=True)
        # logger.info("Unique index created on phone")
    except Exception as e:
        logger.error(f"Index creation error: {str(e)}")

if __name__=="__main__":
    ensure_indexes()