# Work Log

A full-stack application that aggregates and displays your work output from GitHub, Jira, Confluence, and Greenhouse. View your pull requests, tickets, documentation, and interviews in one place with AI-powered summaries.

## Features

- **Dashboard**: View work output by week with easy navigation
- **Custom Date Ranges**: Select any date range to view work artifacts
- **Integration Pages**: Dedicated pages for Pull Requests, Confluence docs, Jira tickets, and Greenhouse interviews (last 6 months)
- **AI Summaries**: Optional AI-powered summaries of your work items using Claude
- **Unified View**: See all your work across platforms in one interface

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- date-fns for date manipulation

### Backend
- FastAPI (Python)
- Integrations: GitHub API, Atlassian (Jira & Confluence), Greenhouse API
- Anthropic Claude API for summaries (optional)

## Project Structure

```
work-log/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client and types
│   │   ├── components/    # Reusable UI components
│   │   │   ├── NavBar.tsx
│   │   │   ├── WeekPicker.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── ArtifactList.tsx
│   │   │   ├── PRCard.tsx
│   │   │   ├── ConfluenceCard.tsx
│   │   │   ├── JiraCard.tsx
│   │   │   └── InterviewCard.tsx
│   │   ├── pages/         # Route pages
│   │   │   ├── DateRangeView.tsx
│   │   │   ├── PullRequestsPage.tsx
│   │   │   ├── ConfluenceDocsPage.tsx
│   │   │   └── JiraTicketsPage.tsx
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx       # Entry point
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app and routes
│   │   ├── models.py      # Pydantic models
│   │   ├── config.py      # Environment configuration
│   │   └── clients/       # External API clients
│   │       ├── github.py
│   │       ├── jira.py
│   │       ├── confluence.py
│   │       ├── greenhouse.py
│   │       └── summarizer.py
│   ├── .env.example
│   └── pyproject.toml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.13+
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   uv venv
   source .venv/bin/activate
   uv sync
   ```

3. Copy the environment example and configure:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your credentials (see [API Key Setup](#api-key-setup) below for detailed instructions)

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## API Key Setup

### GitHub

Create a Personal Access Token (PAT) to access your pull request data.

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a descriptive name (e.g., "Work Log App")
4. Select the following scopes:
   - `repo` - Full control of private repositories (or `public_repo` for public only)
   - `read:org` - Read org membership (if tracking org PRs)
5. Click **Generate token** and copy it immediately (you won't see it again)

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=your-org-name
GITHUB_USERNAME=your-github-username
```

### Atlassian (Jira & Confluence)

Atlassian uses API tokens for authentication along with your account identifiers.

#### Step 1: Create an API Token

1. Go to [Atlassian Account Settings → Security → API tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a label (e.g., "work-log-dev")
4. Copy the token immediately

#### Step 2: Find Your Account ID
##### Note: `ATLASSIAN_URL=https://justworks-tech.atlassian.net/` for Justworks Technology
1. Go to your Atlassian profile: `https://your-company.atlassian.net/wiki/people`
2. Click on your profile
3. Your Account ID is in the URL: `https://your-company.atlassian.net/wiki/people/ACCOUNT_ID_HERE`

Alternatively, use the API:
```bash
curl -u your-email@justworks.com:YOUR_API_TOKEN \
  "https://your-company.atlassian.net/rest/api/3/myself" | jq '.accountId'
```

#### Step 3: Find Your Cloud ID

Run this command with your Atlassian domain:
```bash
curl "https://your-company.atlassian.net/_edge/tenant_info" | jq '.cloudId'
```

```env
ATLASSIAN_URL=https://your-company.atlassian.net
ATLASSIAN_EMAIL=your-email@justworks.com
ATLASSIAN_API_TOKEN=your_api_token_here
ATLASSIAN_ACCOUNT_ID=5f1234567890abcdef123456
ATLASSIAN_CLOUD_ID=12345678-1234-1234-1234-123456789012
CONFLUENCE_URL=https://justworks.atlassian.net/  # Optional: if Confluence is on a different tenant
```

### Greenhouse (Optional)

Track interviews you've conducted via Greenhouse.

#### Step 1: Get API Access

1. You'll need admin access or request a Harvest API key from your Greenhouse admin
2. Go to **Configure → Dev Center → API Credentials** in Greenhouse
3. Create a new API key with **Harvest** permissions
4. Grant at least `Scheduled Interviews` read access

#### Step 2: Find Your User ID

1. Go to your Greenhouse profile page
2. Your User ID is in the URL: `https://app.greenhouse.io/users/USER_ID_HERE`

Or ask your Greenhouse admin to look up your user ID.

```env
GREENHOUSE_API_KEY=your_greenhouse_api_key
GREENHOUSE_USER_ID=123456
```

### Anthropic (Optional)

Enable AI-powered summaries of your work items using Claude.

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key** and copy it

```env
ENABLE_AI_SUMMARIES=true
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

If using a LiteLLM proxy or AWS Bedrock, also set:
```env
ANTHROPIC_BASE_URL=https://your-proxy-url.com
```
Example: `ANTHROPIC_BASE_URL=https://litellm.justworksai.net/`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/artifacts` | GET | Fetch all artifacts for a date range |
| `/health` | GET | Health check |

### Query Parameters

- `start_date` (required): Start of date range (YYYY-MM-DD)
- `end_date` (required): End of date range (YYYY-MM-DD)
- `sources` (optional): Comma-separated list of sources (github, confluence, jira, greenhouse)

## Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard with weekly view |
| `/pull-requests` | All pull requests (last 6 months) |
| `/confluence` | All Confluence documents (last 6 months) |
| `/jira` | All Jira tickets (last 6 months) |
| `/range/:start/:end` | Custom date range view |

## Environment Variables

See `backend/.env.example` for all required environment variables.

## Development

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
# Deploy with your preferred method (Docker, etc.)
```

### Linting

```bash
# Frontend
cd frontend
npm run lint
```
