"""Configuration for the LLM Council."""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv


def _app_dir() -> Path:
    """Base directory for local files: next to the .exe when frozen, repo root otherwise."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parents[1]


APP_DIR = _app_dir()

ENV_PATH = APP_DIR / ".env"

load_dotenv(ENV_PATH)

# Mistral API key
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Council members - list of Mistral API model identifiers
COUNCIL_MODELS = [
    "mistral-large-4-0",
    "zai-glm-5-3",
    "deepseek-v4-1-flash-1017",
    "mistral-small-2603",
    "mistral-medium-3-5",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "mistral-large-4-0"

# Mistral API endpoint
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# Mistral API models endpoint (used to validate API keys)
MISTRAL_MODELS_URL = "https://api.mistral.ai/v1/models"

# Data directory for conversation storage (absolute next to the .exe when frozen,
# so it does not depend on the process working directory)
if getattr(sys, "frozen", False):
    DATA_DIR = str(APP_DIR / "data" / "conversations")
else:
    DATA_DIR = "data/conversations"
