from datetime import date
import requests
from app.config import settings


def get_jira_tickets(start_date: date, end_date: date) -> list[dict]:
    """Fetch Jira tickets assigned to the configured user within the date range."""

    jql = (
        f"assignee = '{settings.atlassian_account_id}' "
        f"AND created >= '{start_date}' "
        f"AND created <= '{end_date}' "
        f"ORDER BY created DESC"
    )

    # Use api.atlassian.com for scoped tokens (ATAT...)
    url = f"https://api.atlassian.com/ex/jira/{settings.atlassian_cloud_id}/rest/api/3/search/jql"
    headers = {
        "Authorization": f"Bearer {settings.atlassian_api_token}",
        "Accept": "application/json"
    }

    response = requests.get(
        url,
        headers=headers,
        params={"jql": jql, "maxResults": 100}
    )
    response.raise_for_status()

    results = response.json()
    tickets = []

    for issue in results.get("issues", []):
        fields = issue["fields"]
        description = fields.get("description")
        # Handle Atlassian Document Format (ADF)
        if isinstance(description, dict):
            description = extract_text_from_adf(description)

        base_url = settings.atlassian_url.rstrip("/")
        tickets.append({
            "key": issue["key"],
            "title": fields["summary"],
            "url": f"{base_url}/browse/{issue['key']}",
            "status": fields["status"]["name"],
            "type": fields["issuetype"]["name"],
            "description": description or "",
        })

    return tickets


def extract_text_from_adf(adf: dict) -> str:
    """Extract plain text from Atlassian Document Format."""
    text_parts = []

    def extract(node):
        if isinstance(node, dict):
            if node.get("type") == "text":
                text_parts.append(node.get("text", ""))
            for child in node.get("content", []):
                extract(child)
        elif isinstance(node, list):
            for item in node:
                extract(item)

    extract(adf)
    return " ".join(text_parts)
