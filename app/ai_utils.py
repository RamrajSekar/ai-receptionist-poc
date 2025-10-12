import openai
import os, json
import logging
import datetime as dt
from dateutil import parser

logger = logging.getLogger(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_appointment_details(transcript: str, incomingPhone: str):
    """
    Extract structured appointment details from natural language transcript using GPT-4o-mini
    """
    prompt = f"""
    Extract structured appointment details from this message: "{transcript}"
    Return JSON with these keys:
    - name
    - intent (book_appointment | cancel_appointment | reschedule)
    - datetime (YYYY-MM-DDT00:00:00 24hr format if possible)
    - phone (if mentioned else us "{incomingPhone}")
    - note (anything extra)
    """

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role":"user","content":prompt}],
            response_format={"type": "json_object"}
        )
        raw_output = response.choices[0].message.content.strip()
        logger.info(f"Raw model output: {raw_output}")
        details = json.loads(raw_output)
        
        dt_obj = parser.parse(details["datetime"])
        now = dt.datetime.now()
        # --- Fix future-year issue ---
        if dt_obj.year < now.year:
            dt_obj = dt_obj.replace(year=now.year)
         # --- Detect possible "stale" dates (AI returned day < today) ---
        if (dt_obj.date() - now.date()).days < 0:
            # Treat it as "tomorrow" or a future intent if it's too far in the past
            if abs((dt_obj.date() - now.date()).days) <= 7:
                dt_obj = now + dt.timedelta(days=1)
            else:
            # Default to today if AI output makes no sense
                dt_obj = now
        # Normalize timezone to UTC for DB
        details["datetime"] = dt_obj.replace(tzinfo=dt.timezone.utc).isoformat()    
        logger.info(f"Extracted Details: {details}")
        return details
    except json.JSONDecodeError:
        logger.warning("Could not parse JSON. Returning Empty Details.")
        return {}
    except Exception as e:
        logger.error(f"Error extracting appointment details: {str(e)}")
        return {}
