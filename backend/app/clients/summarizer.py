import anthropic
from app.config import settings


_client = None

def _get_client():
    global _client
    if _client is None and settings.anthropic_api_key:
        kwargs = {"api_key": settings.anthropic_api_key}
        if settings.anthropic_base_url:
            kwargs["base_url"] = settings.anthropic_base_url
        _client = anthropic.Anthropic(**kwargs)
    return _client


def _truncate(content: str, max_length: int = 200) -> str:
    """Truncate content to max_length with ellipsis."""
    if not content:
        return "No description provided."
    truncated = content[:max_length].strip()
    if len(content) > max_length:
        truncated += "..."
    return truncated


def summarize(content: str, artifact_type: str) -> str:
    """Generate a truncated summary of the artifact content.

    Note: AI summaries for individual artifacts are disabled to reduce API calls.
    Use the "Get AI Summary" button for AI-powered summaries of all artifacts.
    """
    if not content or not content.strip():
        return "No description provided."

    return _truncate(content)


def summarize_artifacts(artifacts_text: str) -> str:
    """Generate an overall summary of work artifacts for performance review context."""
    from app.config import settings

    if not settings.enable_ai_summaries:
        return "AI summaries are disabled. Set ENABLE_AI_SUMMARIES=true in your .env file."

    client = _get_client()
    if not client:
        return "AI summaries are not available. Please configure your ANTHROPIC_API_KEY in .env."

    try:
        message = client.messages.create(
            model="claude-opus-4-5-20251101",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": f"""Summarize the following work artifacts in 2-3 sentences, addressing the user directly in 2nd person (you/your). Focus on key themes, accomplishments, and areas of impact. Do not include any headers, titles, or markdown formatting - just plain text sentences.

{artifacts_text}"""
                }
            ]
        )

        return message.content[0].text
    except Exception as e:
        error_msg = str(e)
        if "401" in error_msg or "Unauthorized" in error_msg:
            return "Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY in .env."
        elif "403" in error_msg or "Forbidden" in error_msg:
            return "Anthropic API access forbidden. Your API key may not have the required permissions."
        elif "429" in error_msg or "rate" in error_msg.lower():
            return "Rate limited by Anthropic API. Please try again in a moment."
        else:
            return f"Failed to generate summary: {error_msg}"
