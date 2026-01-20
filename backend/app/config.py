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

    # Greenhouse (optional)
    greenhouse_api_key: str | None = None
    greenhouse_user_id: str | None = None  # Your Greenhouse user ID for filtering interviews

    # AI Summaries (optional, disabled by default)
    enable_ai_summaries: bool = False
    anthropic_api_key: str | None = None
    anthropic_base_url: str | None = None  # Optional: LiteLLM or other proxy URL

    class Config:
        env_file = ".env"


settings = Settings()
