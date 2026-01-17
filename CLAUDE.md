# Claude Code Instructions

## Project Overview

This is a full-stack work log application with a React frontend and FastAPI backend. It aggregates work artifacts from GitHub, Jira, and Confluence.

## Development Guidelines

### README Maintenance

**Important**: The README.md should be updated after every significant change. This includes:
- Adding new routes or pages
- Adding new components with user-facing functionality
- Changing the project structure
- Adding new API endpoints
- Modifying environment variables or configuration
- Adding new integrations or features

Minor changes like bug fixes, styling tweaks, or internal refactoring do not require README updates.

### Running the Application

**Backend** (port 8000):
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Frontend** (port 5173):
```bash
cd frontend
npm run dev
```

### Key Directories

- `frontend/src/components/` - Reusable UI components
- `frontend/src/pages/` - Route-level page components
- `frontend/src/api/` - API client and TypeScript types
- `backend/app/clients/` - External API integrations (GitHub, Jira, Confluence)
- `backend/app/main.py` - FastAPI routes

### Tech Stack Notes

- Frontend uses React 19, Vite, Tailwind CSS, React Router
- Backend uses FastAPI with Pydantic models
- Date handling uses `date-fns` on frontend
- API returns artifacts with AI-generated summaries (optional, via Anthropic)
