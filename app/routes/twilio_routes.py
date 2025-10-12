from fastapi import APIRouter, Form,HTTPException, BackgroundTasks
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
import logging
import requests
import openai
from openai import RateLimitError,APIError
import os
import time
from app.ai_utils import extract_appointment_details
from app.db_utils import save_appointment
from app.db_utils import get_conflicting_appointment
import datetime as dt
from dateutil import parser
from app.database import appointments_collection

router = APIRouter()
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")
twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN")

def get_xml_length(resp,route):
    # resp_xml = str(resp)
    xml_size = len(str(resp).encode("utf-8"))
    logger.info(f"🧾 TwiML size for {route}: {xml_size} bytes")
    # return Response(content=str(resp), media_type="application/xml")

@router.post("/voice")
async def voice_handler(From: str = Form('4757770732'),To: str = Form('6625473791'),):
    try:
        logger.info(f"Incoming Call from {From} to {To}")
        resp = VoiceResponse()
        resp.say("Hello! You reached receptionist.")
        resp.say("Please say your name and appointment time after the beep, then press the pound key when you are done!")
        resp.record(max_length=20, play_beep=True,finish_on_key="#", action="/process_recording")
        get_xml_length(resp,'Voice')
        return Response(content=str(resp),media_type="application/xml")
    except Exception as e:
        logger.error(f"Error Occurred: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred")

def download_recording_with_retry(rec_url, sid, token, retries=5, wait=3):
    for attempt in range(retries):
        resp = requests.get(f"{rec_url}.wav", auth=(sid, token))
        content_type = resp.headers.get("Content-Type", "")
        logger.info(f"Attempt {attempt+1}: Content-Type: {content_type}")
        if "audio" in content_type:
            return resp
        logger.warning(f"Recording not ready (got {content_type}). Retrying in {wait}s...")
        time.sleep(wait)
    logger.error("❌ Recording not ready after retries.")
    return None

# This is to handle retry from Whisper
def transcribe_with_retry(file_path, retries=5):
    for attempt in range(retries):
        try:
            with open(file_path, "rb") as f:
                transcription = openai.audio.transcriptions.create(
                    model="whisper-1",
                    file=f
                )
            return transcription.text
        except RateLimitError:
            wait = 2 ** attempt  # exponential backoff
            logger.warning(f"Rate limit hit. Retrying in {wait}s...")
            time.sleep(wait)
    raise Exception("Max retries exceeded for transcription")


# @router.post("/process_recording")
# async def process_recording(background_tasks: BackgroundTasks,RecordingUrl: str = Form(...),From: str = Form(...)):
#     try:
#         # Queue the background job
#         background_tasks.add_task(handle_recording,RecordingUrl,From)
#         #Step 3: Respond back to user
#         resp = VoiceResponse()
#         resp.say("Thank you, We received your request!")
#         get_xml_length(resp,'process_recording')
#         return Response(content=str(resp),media_type="application/xml")
#     except RateLimitError:
#         raise HTTPException(status_code=400, detail="Open AI Rate limit Exceeded. Please try again later!")
#     except Exception as e:
#         logger.error(f"Error Occurred: {str(e)}")
#         raise HTTPException(status_code=400, detail="Error Occurred In Process Recording!!")

@router.post("/process_recording")
async def process_recording(RecordingUrl: str = Form(...), From: str = Form(...)):
    """
    Process the recording synchronously to handle conflicts in real time.
    """
    try:
        logger.info(f"Processing recording from {From}: {RecordingUrl}")

        # --- Download recording ---
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        resp2 = VoiceResponse()
        resp2.say("Thank you. Please hold a moment while we process your request.")
        resp = download_recording_with_retry(RecordingUrl, twilio_sid, twilio_token)
        if "audio" not in resp.headers.get("Content-Type", ""):
            logger.error(f" Invalid content type: {resp.headers.get('Content-Type')}")
            raise HTTPException(status_code=400, detail="Invalid recording type")

        audio_file = f"recording_{From}.wav"
        with open(audio_file, "wb") as f:
            f.write(resp.content)

        # --- Transcribe ---
        transcribe = transcribe_with_retry(audio_file)
        if not transcribe:
            logger.warning("⚠️ Transcription failed")
            resp2.say("Sorry, we could not understand your message. Please try again later.")
            raise HTTPException(status_code=400, detail="Transcription failed")

        # --- Extract details ---
        details = extract_appointment_details(transcribe, From)
        appointment_str = details.get("datetime")

        try:
            appointment_dt = parser.parse(appointment_str)
        except Exception:
            logger.warning(f"Could not parse datetime from: {appointment_str}")
            appointment_dt = dt.datetime.now(dt.timezone.utc)

        # --- Conflict check ---
        existing_conflict = get_conflicting_appointment(appointment_dt)

        resp_xml = VoiceResponse()
        if existing_conflict:
            logger.info(f"Conflict found for {From} at {appointment_dt}")
            appointments_collection.update_one(
                {"phone": From},
                {"$set": {"conversation_stage": "awaiting_reschedule", "status": "Conflict"}}
            )
            resp_xml.say("That time is already booked. Please suggest another time after the beep, , then press the pound key when you are done.")
            resp_xml.record(max_length=20, play_beep=True,finish_on_key="#", action="/process_reschedule")
        else:
            save_appointment(
                From,
                details.get("name"),
                details.get("datetime"),
                details.get("intent"),
                transcribe,
                stage="initial"
            )
            resp_xml.say("Thank you. Your appointment has been scheduled successfully!")

        return Response(content=str(resp_xml), media_type="application/xml")

    except Exception as e:
        logger.error(f"Error processing recording for {From}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing recording")

@router.post("/process_reschedule")
async def process_reschedule(background_tasks: BackgroundTasks,RecordingUrl: str = Form(...),From: str = Form(...)):
    try:
        logger.info(f"Reschedule recording from {From}: {RecordingUrl}")
        background_tasks.add_task(handle_recording,RecordingUrl,From,True)
        resp = VoiceResponse()
        resp.say("Thank you. We’ve received your updated appointment time and will confirm shortly.")
        return Response(content=str(resp), media_type="application/xml")
    except RateLimitError:
        raise HTTPException(status_code=400, detail="Open AI Rate limit Exceeded. Please try again later!")
    except Exception as e:
        logger.error(f"Error Processing Reschedule: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred In Processing Reschedule!!")

def handle_recording(rec_url: str, from_number: str, is_reschedule: bool = False):
    try:
        logger.info(f"Backround job: Downloading {rec_url}")
        
        # Load Twilio credentials
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        audio_file = f"recording_{from_number}.wav"

        # Step 1: Download audio as wav same as Twilio format
        resp = download_recording_with_retry(rec_url,twilio_sid,twilio_token)
        content_type = resp.headers.get("Content-Type", "")
        logger.info(f"Content-Type: {content_type}")
        logger.info(f"File size: {len(resp.content)} bytes")
        if "audio" not in content_type:
            logger.error(f"❌ Invalid content type from Twilio: {str(content_type)}")
            return

        # Save to disk
        with open(audio_file, "wb") as f:
            f.write(resp.content)

        # Step 2: Transcribe to Whisper
        transcribe = transcribe_with_retry(audio_file)
        if not transcribe:
            logger.warning("⚠️ Transcription failed after retry!")
            return
        # Step 3: Extract structured details
        logger.info(f"Transcribed text from {from_number}: {transcribe}")
        details = extract_appointment_details(transcribe,from_number)
        appointment_str = details.get("datetime")
           
        #Step 4: Parse datetime safely
        appointment_date = parser.parse(appointment_str)
        logger.info(f"🕒 Parsed appointment datetime: {appointment_date}")
        
        if not appointment_date:
            logger.warning(f"Could not parse datetime from: {appointment_str}")
            appointment_date = dt.datetime.now(dt.timezone.utc)  # fallback

         # Step 5: Check for conflicting appointment (any phone)
        
        if not is_reschedule:
            existing_conflict = get_conflicting_appointment(appointment_date)
            if existing_conflict:
                logger.info(f"Time slot already booked: {appointment_date}, User will be prompted for alternate time")
                appointments_collection.update_one(
                    {"phone":from_number},
                    {"$set": {"conversation_stage": "awaiting_reschedule", "status": "Conflict"}}
                )
                return

        # Step 6: Save
        new_stage = "confirmed" if is_reschedule else "initial"
        save_appointment(
            from_number,
            details.get("name"),
            details.get("datetime"),
            details.get("intent"),
            transcribe,
            stage=new_stage
        )
        # Step 7: If reschedule, update stage + reset status
        if is_reschedule:
            appointments_collection.update_one(
                {"phone": from_number},
                {"$set": {"conversation_stage": "confirmed", "status": "Pending"}}
            )
        logger.info(f"✅ Appointment {'rescheduled' if is_reschedule else 'booked'} successfully for {from_number}")
    except Exception as e:
            logger.error(f"Error in backgroud transcribtion: {str(e)}!")