# Work Log

A full-stack application that aggregates and displays your work output from GitHub, Jira, and Confluence. View your pull requests, tickets, and documentation in one place with AI-powered summaries.

## Features

- **Dashboard**: View work output by week with easy navigation
- **Custom Date Ranges**: Select any date range to view work artifacts
- **Integration Pages**: Dedicated pages for Pull Requests, Confluence docs, and Jira tickets (last 6 months)
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
- Integrations: GitHub API, Atlassian (Jira & Confluence)
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
│   │   │   └── JiraCard.tsx
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

4. Edit `.env` with your credentials:
   - **GitHub**: Personal access token, org name, username
   - **Atlassian**: URL, email, API token, account ID, cloud ID
   - **Anthropic** (optional): API key for AI summaries

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

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/artifacts` | GET | Fetch all artifacts for a date range |
| `/health` | GET | Health check |

### Query Parameters

- `start_date` (required): Start of date range (YYYY-MM-DD)
- `end_date` (required): End of date range (YYYY-MM-DD)

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
