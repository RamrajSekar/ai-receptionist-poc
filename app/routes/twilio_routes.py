from fastapi import APIRouter, Form
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/voice")
async def voice_handler(From: str = Form('4757770732'),To: str = Form('6625473791'),):
    logger.info(f"Incoming Call from {From} to {To}")
    resp = VoiceResponse()
    resp.say("Hello! You've reached the Receoptionist. Please say your name and date for your appointment after the beep!")
    resp.record(max_length=20, play_beep=True, action="/process_recording")

    return Response(content=str(resp),media_type="application/xml")

@router.post("/process_recording")
async def process_recording(RecordingUrl: str = Form(...),From: str = Form(...)):
    logger.info(f"Recording from {From}: {RecordingUrl}")

    # ToDo: Download and do speech to text later
    resp = VoiceResponse()
    resp.say("Thank you, We received you apoointment request!")
    return Response(content=str(resp),media_type="application/xml")