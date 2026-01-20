from datetime import date
import logging
import requests
from requests.auth import HTTPBasicAuth
from app.config import settings

logger = logging.getLogger(__name__)

GREENHOUSE_API_BASE = "https://harvest.greenhouse.io/v1"


def get_interviews(start_date: date, end_date: date) -> list[dict]:
    """Fetch interviews conducted by the configured user within the date range."""
    if not settings.greenhouse_api_key:
        logger.info("Greenhouse API key not configured, skipping")
        return []

    interviews = []

    try:
        # Greenhouse uses Basic Auth with API key as username, blank password
        auth = HTTPBasicAuth(settings.greenhouse_api_key, "")

        params = {
            "created_after": f"{start_date}T00:00:00Z",
            "created_before": f"{end_date}T23:59:59Z",
            "per_page": 100,
        }

        # Filter by user if configured
        if settings.greenhouse_user_id:
            params["user_id"] = settings.greenhouse_user_id

        response = requests.get(
            f"{GREENHOUSE_API_BASE}/scheduled_interviews",
            auth=auth,
            params=params,
            timeout=30,
        )

        if response.status_code == 401:
            logger.warning("Greenhouse API authentication failed - check API key")
            return []
        elif response.status_code == 403:
            logger.warning("Greenhouse API access forbidden - check permissions")
            return []

        response.raise_for_status()
        data = response.json()

        for interview in data:
            # Extract relevant fields
            application = interview.get("application", {}) or {}
            candidate = application.get("candidate", {}) or {}
            job = application.get("job", {}) or {}

            # Get interviewer names
            interviewers = interview.get("interviewers", []) or []
            interviewer_names = [i.get("name", "") for i in interviewers if i.get("name")]

            # Get interview date
            scheduled_at = interview.get("start", {}).get("date_time", "")
            interview_date = scheduled_at[:10] if scheduled_at else ""

            interviews.append({
                "id": interview.get("id"),
                "candidate_name": candidate.get("name", "Unknown Candidate"),
                "job_title": job.get("name", "Unknown Position"),
                "interview_type": interview.get("interview", {}).get("name", "Interview"),
                "scheduled_at": interview_date,
                "status": interview.get("status", "scheduled"),
                "interviewers": interviewer_names,
                "organizer": interview.get("organizer", {}).get("name", ""),
            })

    except requests.exceptions.RequestException as e:
        logger.error(f"Greenhouse API request failed: {e}")
    except Exception as e:
        logger.error(f"Error processing Greenhouse data: {e}")

    return interviews
