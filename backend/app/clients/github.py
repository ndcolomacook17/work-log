from datetime import date
import logging
from github import Github
from github.GithubException import GithubException, RateLimitExceededException
from app.config import settings

logger = logging.getLogger(__name__)


def get_pull_requests(start_date: date, end_date: date) -> list[dict]:
    """Fetch PRs authored by the configured user within the date range."""
    # Disable retry to avoid 60s backoff on rate limits
    g = Github(settings.github_token, retry=0)

    # Build search query
    query = f"author:{settings.github_username} is:pr created:{start_date}..{end_date}"
    if settings.github_org:
        query += f" org:{settings.github_org}"

    prs = []

    try:
        results = g.search_issues(query, sort="created", order="desc")

        for issue in results:
            # Extract repo from URL to avoid extra API call
            # URL format: https://github.com/owner/repo/pull/123
            url_parts = issue.html_url.split("/")
            repo_name = f"{url_parts[3]}/{url_parts[4]}"

            prs.append({
                "title": issue.title,
                "url": issue.html_url,
                "repo": repo_name,
                "state": issue.state,
                "created_at": issue.created_at.date(),
                "body": issue.body or "",
            })
    except RateLimitExceededException:
        logger.warning("GitHub rate limit exceeded, returning empty PR list")
    except GithubException as e:
        if e.status == 403:
            logger.warning(f"GitHub 403 Forbidden - check token permissions or SSO authorization: {e}")
        else:
            logger.error(f"GitHub API error: {e}")

    return prs
