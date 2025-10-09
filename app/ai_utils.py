import openai
import os, json
import logging

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
        logger.info(f"Extracted Details: {details}")
        return details
    except json.JSONDecodeError:
        logger.warning("Could not parse JSON. Returning Empty Details.")
        return {}
    except Exception as e:
        logger.error(f"Error extracting appointment details: {str(e)}")
        return {}
