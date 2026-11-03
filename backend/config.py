"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# Mistral API key
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Council members - list of Mistral API model identifiers
COUNCIL_MODELS = [
    "mistral-large-4-0",
    "zai-glm-5-3",
    "deepseek-v4p1-flash-1017",
    "mistral-small-2603",
    "mistral-medium-3-5",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "mistral-large-4-0"

# Mistral API endpoint
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
