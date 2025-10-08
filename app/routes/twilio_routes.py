from fastapi import APIRouter, Form,HTTPException, BackgroundTasks
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
import logging
import requests
import openai
from openai import RateLimitError,APIError
import os
import time

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
        resp.say("Hello! You reached receptionist. Please state your name and appointment time after the beep!")
        resp.record(max_length=20, play_beep=True, action="/process_recording")
        # resp.say("Press the # key to end the call!")
        # resp.gather(finish_on_key='#')
        get_xml_length(resp,'Voice')
        return Response(content=str(resp),media_type="application/xml")
    except Exception as e:
        logger.error(f"Error Occurred: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred")

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


def handle_recording(rec_url: str, from_number: str):
    try:
        logger.info(f"Backround job: Downloading {rec_url}")
        
        # Load Twilio credentials
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        assert isinstance(twilio_sid, str)
        assert isinstance(twilio_token, str)
        # Step 1: Download audio as wav same as Twilio format
        twilio_auth: tuple[str, str] = (twilio_sid, twilio_token)
        audio_file = f"recording_{from_number}.wav"
        resp = requests.get(f"{rec_url}?Format=wav",auth=twilio_auth)
        content_type = resp.headers.get("Content-Type", "")
        logger.info(f"Content-Type:", {content_type})
        logger.info(f"File size:", {len(resp.content)})
        if "audio" not in content_type:
            logger.error(f"❌ Invalid content type from Twilio: {content_type}")
            return
        # Save to disk
        with open(audio_file, "wb") as f:
            f.write(resp.content)
        # Step 2: Transcribe to Whisper
        transcribe = transcribe_with_retry(audio_file)
        if transcribe:
            logger.info(f"Transcribed text from {from_number}: {transcribe}")
        else:
            logger.info("Failed Transcription After Retry!")
    except Exception as e:
            logger.error(f"Error in backgroud transcribtion: {str(e)}!")



@router.post("/process_recording")
async def process_recording(background_tasks: BackgroundTasks,RecordingUrl: str = Form(...),From: str = Form(...)):
    try:
        # Commented on 7/10/2025
        # logger.info(f"Recording from {From}: {RecordingUrl}")

        # # Step 1: Download audio as wav same as Twilio format
        # audio_file = "call_recording.wav"
        # resp = requests.get(f"{RecordingUrl}.wav")
        # with open(audio_file, "wb") as f:
        #     f.write(resp.content)
        # # Step 2: Transcribe to Whisper
        # # with open(audio_file, "rb") as f:
        # #     transcribe = openai.audio.transcriptions.create(model="whisper-1",file=f)
        # #     transcribe = openai.audio.transcriptions.create(model="whisper-1",file=f)
        # # user_text = transcribe.text
        # transcribe = transcribe_with_retry(audio_file)
        # logger.info(f"Transcribed text from {From}: {transcribe}")
        # Queue the background job
        background_tasks.add_task(handle_recording,RecordingUrl,From)
        #Step 3: Respond back to user
        resp = VoiceResponse()
        resp.say("Thank you, We received your request!")
        get_xml_length(resp,'process_recording')
        return Response(content=str(resp),media_type="application/xml")
    except RateLimitError:
        raise HTTPException(status_code=400, detail="Open AI Rate limit Exceeded. Please try again later!")
    except Exception as e:
        logger.error(f"Error Occurred: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred In Process Recording!!")