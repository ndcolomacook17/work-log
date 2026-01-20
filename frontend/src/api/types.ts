export interface PullRequest {
  title: string;
  url: string;
  repo: string;
  state: string;
  created_at: string;
  summary: string;
}

export interface ConfluenceDoc {
  title: string;
  url: string;
  space: string;
  created_at: string;
  summary: string;
}

export interface JiraTicket {
  key: string;
  title: string;
  url: string;
  status: string;
  type: string;
  summary: string;
}

export interface Interview {
  candidate_name: string;
  job_title: string;
  interview_type: string;
  scheduled_at: string;
  status: string;
}

export interface ArtifactsResponse {
  pull_requests: PullRequest[];
  confluence_docs: ConfluenceDoc[];
  jira_tickets: JiraTicket[];
  interviews: Interview[];
}

export interface SummaryResponse {
  summary: string;
}
