import os
from pymongo import MongoClient
import logging
from dotenv import load_dotenv

# Load .env file
load_dotenv()

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

try:
    appointments_collection.create_index([("phone", 1), ("datetime", 1)], unique=True)
    logger.info("Unique index created on phone")
except Exception as e:
    logger.error(f"Index creation error: {str(e)}")