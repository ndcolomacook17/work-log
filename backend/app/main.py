from datetime import date
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import logging

from pydantic import BaseModel
from app.models import ArtifactsResponse, PullRequest, ConfluenceDoc, JiraTicket, Interview
from app.clients import github, jira, confluence, greenhouse, summarizer

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
    sources: Optional[str] = Query(None, description="Comma-separated list of sources: github,confluence,jira,greenhouse"),
):
    """Fetch all work artifacts within the specified date range."""

    # Parse sources parameter
    if sources:
        source_list = [s.strip().lower() for s in sources.split(",")]
    else:
        source_list = ["github", "confluence", "jira", "greenhouse"]

    # Fetch raw data from selected sources in parallel (gracefully handle failures)
    raw_prs = []
    raw_tickets = []
    raw_docs = []
    raw_interviews = []

    def fetch_github():
        if "github" not in source_list:
            return []
        try:
            start = time.time()
            result = github.get_pull_requests(start_date, end_date)
            logger.info(f"GitHub fetch took {time.time() - start:.2f}s")
            return result
        except Exception as e:
            logger.error(f"GitHub fetch failed: {e}")
            return []

    def fetch_jira():
        if "jira" not in source_list:
            return []
        try:
            start = time.time()
            result = jira.get_jira_tickets(start_date, end_date)
            logger.info(f"Jira fetch took {time.time() - start:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Jira fetch failed: {e}")
            return []

    def fetch_confluence():
        if "confluence" not in source_list:
            return []
        try:
            start = time.time()
            result = confluence.get_confluence_docs(start_date, end_date)
            logger.info(f"Confluence fetch took {time.time() - start:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Confluence fetch failed: {e}")
            return []

    def fetch_greenhouse():
        if "greenhouse" not in source_list:
            return []
        try:
            start = time.time()
            result = greenhouse.get_interviews(start_date, end_date)
            logger.info(f"Greenhouse fetch took {time.time() - start:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Greenhouse fetch failed: {e}")
            return []

    with ThreadPoolExecutor(max_workers=4) as executor:
        github_future = executor.submit(fetch_github)
        jira_future = executor.submit(fetch_jira)
        confluence_future = executor.submit(fetch_confluence)
        greenhouse_future = executor.submit(fetch_greenhouse)

        raw_prs = github_future.result()
        raw_tickets = jira_future.result()
        raw_docs = confluence_future.result()
        raw_interviews = greenhouse_future.result()

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

    interviews = [
        Interview(
            candidate_name=interview["candidate_name"],
            job_title=interview["job_title"],
            interview_type=interview["interview_type"],
            scheduled_at=interview["scheduled_at"],
            status=interview["status"],
        )
        for interview in raw_interviews
    ]

    return ArtifactsResponse(
        pull_requests=pull_requests,
        confluence_docs=confluence_docs,
        jira_tickets=jira_tickets,
        interviews=interviews,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


class SummaryRequest(BaseModel):
    pull_requests: list[PullRequest]
    confluence_docs: list[ConfluenceDoc]
    jira_tickets: list[JiraTicket]
    interviews: list[Interview] = []


class SummaryResponse(BaseModel):
    summary: str


@app.post("/api/summarize", response_model=SummaryResponse)
def summarize_artifacts(request: SummaryRequest):
    """Generate an AI summary of the provided artifacts."""

    # Build a condensed representation of artifacts for the prompt
    artifact_text = []

    if request.pull_requests:
        pr_list = "\n".join([f"- {pr.title} ({pr.state}) - {pr.summary}" for pr in request.pull_requests[:20]])
        artifact_text.append(f"Pull Requests ({len(request.pull_requests)} total):\n{pr_list}")

    if request.confluence_docs:
        doc_list = "\n".join([f"- {doc.title} - {doc.summary}" for doc in request.confluence_docs[:20]])
        artifact_text.append(f"Confluence Documents ({len(request.confluence_docs)} total):\n{doc_list}")

    if request.jira_tickets:
        ticket_list = "\n".join([f"- {ticket.key}: {ticket.title} ({ticket.status}) - {ticket.summary}" for ticket in request.jira_tickets[:20]])
        artifact_text.append(f"Jira Tickets ({len(request.jira_tickets)} total):\n{ticket_list}")

    if request.interviews:
        interview_list = "\n".join([f"- {i.candidate_name} for {i.job_title} ({i.interview_type}) - {i.status}" for i in request.interviews[:20]])
        artifact_text.append(f"Interviews Conducted ({len(request.interviews)} total):\n{interview_list}")

    if not artifact_text:
        return SummaryResponse(summary="No artifacts to summarize.")

    combined_text = "\n\n".join(artifact_text)

    summary = summarizer.summarize_artifacts(combined_text)

    return SummaryResponse(summary=summary)


# Test comment for GH API PR testing
