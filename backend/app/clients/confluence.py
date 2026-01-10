from datetime import date
import requests
from app.config import settings


def get_confluence_docs(start_date: date, end_date: date) -> list[dict]:
    """Fetch Confluence pages created by the configured user within the date range."""

    cql = (
        f"creator = '{settings.atlassian_account_id}' "
        f"AND created >= '{start_date}' "
        f"AND created <= '{end_date}' "
        f"ORDER BY created DESC"
    )

    # Use api.atlassian.com for scoped tokens (ATAT...)
    url = f"https://api.atlassian.com/ex/confluence/{settings.atlassian_cloud_id}/wiki/rest/api/search"
    headers = {
        "Authorization": f"Bearer {settings.atlassian_api_token}",
        "Accept": "application/json"
    }

    response = requests.get(
        url,
        headers=headers,
        params={"cql": cql, "limit": 100}
    )
    response.raise_for_status()

    results = response.json()
    docs = []

    base_url = settings.atlassian_url.rstrip("/")
    for result in results.get("results", []):
        content = result.get("content", result)
        space_key = content.get("space", {}).get("key", "")

        page_id = content.get("id", "")
        page_url = f"{base_url}/wiki/spaces/{space_key}/pages/{page_id}"

        excerpt = result.get("excerpt", "")

        docs.append({
            "title": content.get("title", ""),
            "url": page_url,
            "space": space_key,
            "created_at": start_date,
            "excerpt": excerpt,
        })

    return docs
