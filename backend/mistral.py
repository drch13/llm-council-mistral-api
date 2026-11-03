"""Mistral API client for making LLM requests."""

import httpx
from typing import List, Dict, Any, Optional
from . import config


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


def classify_error(exc: Exception) -> Dict[str, str]:
    """Classify a request failure into a user-facing error type + message."""
    if isinstance(exc, httpx.HTTPStatusError):
        code = exc.response.status_code
        if code in (401, 403):
            return {"type": "invalid_api_key",
                    "message": f"Invalid or missing Mistral API key (HTTP {code}). Update it via Settings."}
        if code == 404:
            return {"type": "model_unavailable",
                    "message": "Model not found on the Mistral API (HTTP 404) — the model id may be wrong or retired."}
        if code == 429:
            return {"type": "rate_limited",
                    "message": "Mistral API rate limit or quota exceeded (HTTP 429)."}
        if code >= 500:
            return {"type": "mistral_server_error",
                    "message": f"Mistral API server error (HTTP {code})."}
        return {"type": "http_error", "message": f"Mistral API error (HTTP {code})."}
    if isinstance(exc, (httpx.TimeoutException, httpx.ConnectError, httpx.NetworkError)):
        return {"type": "network_error",
                "message": "Cannot reach the Mistral API — check your internet connection."}
    return {"type": "unknown_error", "message": str(exc) or "Unknown error."}


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
        Response dict with 'content' and optional 'reasoning_details' on success,
        or {'content': None, 'error': {'type', 'message'}} on failure. None only
        if the request could not even be attempted.
    """
    if not config.MISTRAL_API_KEY:
        return {
            'content': None,
            'error': {
                'type': 'missing_api_key',
                'message': 'No Mistral API key configured. Add it via Settings.'
            }
        }

    headers = {
        "Authorization": f"Bearer {config.MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                config.MISTRAL_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            message = data['choices'][0]['message']

            return {
                'content': _extract_content(message),
                'reasoning_details': message.get('reasoning_details'),
                'error': None
            }

    except Exception as e:
        error = classify_error(e)
        print(f"Error querying model {model}: [{error['type']}] {error['message']}")
        return {'content': None, 'error': error}


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
        Dict mapping model identifier to response dict (success or failure with 'error')
    """
    import asyncio

    # Create tasks for all models
    tasks = [query_model(model, messages) for model in models]

    # Wait for all to complete
    responses = await asyncio.gather(*tasks)

    # Map models to their responses
    return {model: response for model, response in zip(models, responses)}
