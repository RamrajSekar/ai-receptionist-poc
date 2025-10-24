from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import uvicorn
import os
import logging
from datetime import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def send_booking_email(booking: dict):
    """
    Send email notification to owner/admin when a new appointment is created.
    """
    try:
        
        message = Mail(
        from_email=os.getenv("SMTP_USER"),
        to_emails=os.getenv("MAIL_TO"),
        subject=f"📅 New Appointment from {booking.get('name', 'Unknown')} phone {booking.get('phone', 'Unknown')}",
        html_content=f"""
            <h3>New Appointment Request</h3>
            <p><b>Name:</b> {booking.get('name')}</p>
            <p><b>Phone:</b> {booking.get('phone')}</p>
            <p><b>Date/Time:</b> {booking.get('datetime')}</p>
            <p><b>Status:</b> {booking.get('status')}</p>
            <p><b>Transcript:</b> {booking.get('transcript')}</p>
        """,
        )
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        print(response.status_code)
        logger.info(f"📧 Email notification sent for booking: {booking.get('name')}")
    except Exception as e:
        logger.error(f"❌ Failed to send booking email: {str(e)}")