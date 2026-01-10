from pydantic import BaseModel
from datetime import date


class PullRequest(BaseModel):
    title: str
    url: str
    repo: str
    state: str
    created_at: date
    summary: str


class ConfluenceDoc(BaseModel):
    title: str
    url: str
    space: str
    created_at: date
    summary: str


class JiraTicket(BaseModel):
    key: str
    title: str
    url: str
    status: str
    type: str
    summary: str


class ArtifactsResponse(BaseModel):
    pull_requests: list[PullRequest]
    confluence_docs: list[ConfluenceDoc]
    jira_tickets: list[JiraTicket]
