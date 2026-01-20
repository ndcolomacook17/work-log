from datetime import date
import requests
from app.config import settings


def get_confluence_docs(start_date: date, end_date: date) -> list[dict]:
    """Fetch Confluence pages created by the configured user within the date range."""

    cql = (
        f"creator = '{settings.atlassian_account_id}' "
        f"AND type in (page, blogpost) "
        f"AND created >= '{start_date}' "
        f"AND created <= '{end_date}' "
        f"ORDER BY created DESC"
    )

    # Use confluence_url if set, otherwise fall back to atlassian_url
    base_url = (settings.confluence_url or settings.atlassian_url).rstrip("/")
    url = f"{base_url}/wiki/rest/api/search"

    response = requests.get(
        url,
        auth=(settings.atlassian_email, settings.atlassian_api_token),
        headers={"Accept": "application/json"},
        params={"cql": cql, "limit": 100}
    )
    response.raise_for_status()

    results = response.json()
    docs = []
    for result in results.get("results", []):
        content = result.get("content", result)
        space_key = content.get("space", {}).get("key", "")

        page_id = content.get("id", "")
        page_url = f"{base_url}/wiki/pages/viewpage.action?pageId={page_id}"

        excerpt = result.get("excerpt", "")

        docs.append({
            "title": content.get("title", ""),
            "url": page_url,
            "space": space_key,
            "created_at": start_date,
            "excerpt": excerpt,
        })

    return docs
