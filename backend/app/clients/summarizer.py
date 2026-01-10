import anthropic
from app.config import settings


_client = None

def _get_client():
    global _client
    if _client is None and settings.anthropic_api_key:
        _client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client


def summarize(content: str, artifact_type: str) -> str:
    """Generate a concise summary of the artifact content using Claude."""
    if not content or not content.strip():
        return "No description provided."

    if not settings.enable_ai_summaries:
        # Return truncated original content
        truncated = content[:200].strip()
        if len(content) > 200:
            truncated += "..."
        return truncated

    client = _get_client()
    if not client:
        return content[:200] + "..." if len(content) > 200 else content

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=150,
        messages=[
            {
                "role": "user",
                "content": f"Summarize this {artifact_type} in 1-2 sentences, focusing on the key accomplishment or purpose:\n\n{content[:2000]}"
            }
        ]
    )

    return message.content[0].text
