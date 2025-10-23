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

# mail_config = ConnectionConfig(
#     MAIL_USERNAME=os.getenv("SMTP_USER"),
#     MAIL_PASSWORD=os.getenv("SMTP_PASS"),
#     MAIL_FROM=os.getenv("MAIL_FROM"),
#     MAIL_PORT=587,
#     MAIL_SERVER="smtp.gmail.com",
#     USE_CREDENTIALS=True,
#     MAIL_STARTTLS=True,
#     MAIL_SSL_TLS=False
# )

async def send_booking_email(booking: dict):
    """
    Send email notification to owner/admin when a new appointment is created.
    """
    try:
        # fm = FastMail(mail_config)
        # subject = f"📅 New Appointment from {booking.get('name', 'Unknown')} phone {booking.get('phone', 'Unknown')}"
        # body = f"""
        # <h2>New Appointment Request</h2>
        # <p><b>Name:</b> {booking.get('name', 'N/A')}</p>
        # <p><b>Phone:</b> {booking.get('phone', 'N/A')}</p>
        # <p><b>Date/Time:</b> {datetime.fromisoformat(booking['datetime']).strftime('%Y-%m-%d %I:%M %p')}</p>
        # <p><b>Status:</b> {booking.get('status', 'Pending')}</p>
        # <p><b>Transcript:</b> {booking.get('transcript', '')}</p>
        # """

        # message = MessageSchema(
        #     subject=subject,
        #     recipients=["sekar.ramraj@gmail.com"],  # replace with owner/admin email
        #     body=body,
        #     subtype="html",
        # )
        message = Mail(
        from_email='your_email@gmail.com',
        to_emails='your_admin_email@gmail.com',
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
        await sg.send(message)
        logger.info(f"📧 Email notification sent for booking: {booking.get('name')}")
    except Exception as e:
        logger.error(f"❌ Failed to send booking email: {str(e)}")