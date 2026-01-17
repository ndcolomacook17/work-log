from datetime import date
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.models import ArtifactsResponse, PullRequest, ConfluenceDoc, JiraTicket
from app.clients import github, jira, confluence, summarizer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Work Output Aggregator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/artifacts", response_model=ArtifactsResponse)
def get_artifacts(
    start_date: date = Query(..., description="Start of date range"),
    end_date: date = Query(..., description="End of date range"),
):
    """Fetch all work artifacts within the specified date range."""

    # Fetch raw data from all sources (gracefully handle failures)
    raw_prs = []
    raw_tickets = []
    raw_docs = []

    try:
        raw_prs = github.get_pull_requests(start_date, end_date)
    except Exception as e:
        logger.error(f"GitHub fetch failed: {e}")

    try:
        raw_tickets = jira.get_jira_tickets(start_date, end_date)
    except Exception as e:
        logger.error(f"Jira fetch failed: {e}")

    try:
        raw_docs = confluence.get_confluence_docs(start_date, end_date)
    except Exception as e:
        logger.error(f"Confluence fetch failed: {e}")

    # Generate summaries and build response models
    pull_requests = [
        PullRequest(
            title=pr["title"],
            url=pr["url"],
            repo=pr["repo"],
            state=pr["state"],
            created_at=pr["created_at"],
            summary=summarizer.summarize(pr["body"], "pull request"),
        )
        for pr in raw_prs
    ]

    jira_tickets = [
        JiraTicket(
            key=ticket["key"],
            title=ticket["title"],
            url=ticket["url"],
            status=ticket["status"],
            type=ticket["type"],
            summary=summarizer.summarize(ticket["description"], "Jira ticket"),
        )
        for ticket in raw_tickets
    ]

    confluence_docs = [
        ConfluenceDoc(
            title=doc["title"],
            url=doc["url"],
            space=doc["space"],
            created_at=doc["created_at"],
            summary=summarizer.summarize(doc["excerpt"], "Confluence document"),
        )
        for doc in raw_docs
    ]

    return ArtifactsResponse(
        pull_requests=pull_requests,
        confluence_docs=confluence_docs,
        jira_tickets=jira_tickets,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


# Test comment for GH API PR testing
