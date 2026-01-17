from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # GitHub
    github_token: str
    github_org: str | None = None  # Optional: filter to specific org
    github_username: str

    # Atlassian (Confluence & Jira)
    atlassian_url: str  # Jira URL
    atlassian_email: str
    atlassian_api_token: str
    atlassian_account_id: str
    atlassian_cloud_id: str
    confluence_url: str | None = None  # Optional: separate Confluence URL if different tenant

    # AI Summaries (optional, disabled by default)
    enable_ai_summaries: bool = False
    anthropic_api_key: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
