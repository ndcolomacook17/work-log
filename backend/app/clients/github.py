from datetime import date
from github import Github
from app.config import settings


def get_pull_requests(start_date: date, end_date: date) -> list[dict]:
    """Fetch PRs authored by the configured user within the date range."""
    g = Github(settings.github_token)

    # Build search query
    query = f"author:{settings.github_username} is:pr created:{start_date}..{end_date}"
    if settings.github_org:
        query += f" org:{settings.github_org}"

    prs = []
    results = g.search_issues(query, sort="created", order="desc")

    for issue in results:
        pr = issue.as_pull_request()
        state = "merged" if pr.merged else pr.state
        prs.append({
            "title": pr.title,
            "url": pr.html_url,
            "repo": pr.base.repo.full_name,
            "state": state,
            "created_at": pr.created_at.date(),
            "body": pr.body or "",
        })

    return prs
