import hashlib
import logging
import math
from typing import List, Optional
import requests

from app.config import settings

logger = logging.getLogger(__name__)

VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings"
EMBEDDING_DIMENSION = 1024


def generate_fallback_embedding(text: str) -> List[float]:
    """
    Generates a normalized 1024-dimensional vector deterministically using SHA-256 seed.
    Used ONLY when VOYAGE_API_KEY is not set.
    Logs explicit warning as required.
    """
    logger.warning("⚠️ USING FALLBACK EMBEDDING - NOT REAL VOYAGE API")
    print("⚠️ USING FALLBACK EMBEDDING - NOT REAL VOYAGE API")

    raw_vec = []
    text_bytes = text.encode("utf-8")
    for i in range(EMBEDDING_DIMENSION):
        h = hashlib.sha256(text_bytes + i.to_bytes(4, "big")).digest()
        val = (int.from_bytes(h[:4], "big") / (2**32 - 1)) * 2.0 - 1.0
        raw_vec.append(val)

    # Normalize vector to L2 unit length
    magnitude = math.sqrt(sum(x * x for x in raw_vec))
    if magnitude == 0:
        return [0.0] * EMBEDDING_DIMENSION
    return [x / magnitude for x in raw_vec]


def get_embedding(text: str, input_type: Optional[str] = "document") -> List[float]:
    """
    Returns 1024-dimensional float vector embedding for the input text.
    Calls Voyage AI API if VOYAGE_API_KEY is configured.
    Supports input_type ('document' or 'query').
    """
    api_key = settings.voyage_api_key.strip()

    if not api_key or api_key == "mock_key":
        return generate_fallback_embedding(text)

    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "input": [text],
            "model": "voyage-3-lite",
        }
        if input_type in ("query", "document"):
            payload["input_type"] = input_type

        response = requests.post(VOYAGE_API_URL, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        embedding = data["data"][0]["embedding"]

        if len(embedding) != EMBEDDING_DIMENSION:
            logger.warning(
                f"Voyage AI returned dimension {len(embedding)}, expected {EMBEDDING_DIMENSION}"
            )
            if len(embedding) < EMBEDDING_DIMENSION:
                embedding = embedding + [0.0] * (EMBEDDING_DIMENSION - len(embedding))
            else:
                embedding = embedding[:EMBEDDING_DIMENSION]

        return embedding
    except Exception as e:
        logger.error(f"Error calling Voyage AI API: {e}. Falling back to fallback generator.")
        return generate_fallback_embedding(text)
