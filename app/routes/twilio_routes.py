from fastapi import APIRouter, Form,HTTPException
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
import logging
import requests
import openai
from openai import RateLimitError,APIError
import os

router = APIRouter()
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/voice")
async def voice_handler(From: str = Form('4757770732'),To: str = Form('6625473791'),):
    try:
        logger.info(f"Incoming Call from {From} to {To}")
        resp = VoiceResponse()
        resp.say("Hello! You've reached the AI Receptionist. Please say your name followed by date and time for your appointment after the beep!")
        resp.record(max_length=20, play_beep=True, action="/process_recording")

        return Response(content=str(resp),media_type="application/xml")
    except Exception as e:
        logger.error(f"Error Occurred: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred")

@router.post("/process_recording")
async def process_recording(RecordingUrl: str = Form(...),From: str = Form(...)):
    try:
        logger.info(f"Recording from {From}: {RecordingUrl}")

        # Step 1: Download audio as wav same as Twilio format
        audio_file = "call_recording.wav"
        resp = requests.get(f"{RecordingUrl}.wav")
        with open(audio_file, "wb") as f:
            f.write(resp.content)
        #Step 2: Transcribe to Whisper
        with open(audio_file, "rb") as f:
            transcribe = openai.audio.transcriptions.create(model="whisper-1",file=f)
        user_text = transcribe.text
        logger.info(f"Transcribed text from {From}: {user_text}")
        #Step 3: Respond back to user
        resp = VoiceResponse()
        resp.say("Thank you, We received you apoointment request!")
        return Response(content=str(resp),media_type="application/xml")
    except RateLimitError:
        raise HTTPException(status_code=400, detail="Open AI Rate limit Exceeded. Please try again later!")
    except Exception as e:
        logger.error(f"Error Occurred: {str(e)}")
        raise HTTPException(status_code=400, detail="Error Occurred")