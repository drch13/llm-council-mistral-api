"""Mistral API client for making LLM requests."""

import httpx
from typing import List, Dict, Any, Optional
from .config import MISTRAL_API_KEY, MISTRAL_API_URL


def _extract_content(message: Dict[str, Any]) -> Optional[str]:
    """Extract text content from a Mistral message (string or chunk list)."""
    content = message.get('content')
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [
            chunk.get('text', '')
            for chunk in content
            if isinstance(chunk, dict) and chunk.get('type') == 'text'
        ]
        return ''.join(parts) if parts else None
    return None


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a single model via the Mistral API.

    Args:
        model: Mistral model identifier (e.g., "mistral-large-4-0")
        messages: List of message dicts with 'role' and 'content'
        timeout: Request timeout in seconds

    Returns:
        Response dict with 'content' and optional 'reasoning_details', or None if failed
    """
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                MISTRAL_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']

            return {
                'content': _extract_content(message),
                'reasoning_details': message.get('reasoning_details')
            }

    except Exception as e:
        print(f"Error querying model {model}: {e}")
        return None


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple models in parallel.

    Args:
        models: List of Mistral model identifiers
        messages: List of message dicts to send to each model

    Returns:
        Dict mapping model identifier to response dict (or None if failed)
    """
    import asyncio

    # Create tasks for all models
    tasks = [query_model(model, messages) for model in models]

    # Wait for all to complete
    responses = await asyncio.gather(*tasks)

    # Map models to their responses
    return {model: response for model, response in zip(models, responses)}
