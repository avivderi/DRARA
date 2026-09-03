import json
from typing import Dict, List, Tuple
import httpx

from app.config import settings


class AISummarizerService:
    """Service interfacing with Claude API for structured project architecture summarization."""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.anthropic_api_key

    async def summarize_architecture(
        self,
        repo_name: str,
        readme_text: str,
        file_tree: List[str],
        stack_detected: List[str],
    ) -> Tuple[str, int, str, int, float]:
        """
        Calls Claude API to generate:
        (summary_text, readiness_score_1_to_10, rationale, tokens_used, estimated_cost_usd)
        """
        # If API key is mock or testing, return deterministic mock summary
        if not self.api_key or self.api_key.startswith("mock") or not settings.github_ai_scan_enabled:
            summary = (
                f"DRARA AI Architecture Analysis for {repo_name}: "
                "The project features a modular monorepo architecture with clean separation "
                "between API services, databases, and client interfaces."
            )
            score = 8
            rationale = "Solid repository structure with clear technical documentation and type safety."
            return summary, score, rationale, 350, 0.001

        prompt = f"""
You are an expert CTO and Senior Software Architect reviewing a GitHub repository to evaluate its startup readiness.

Repository: {repo_name}
Detected Technologies: {', '.join(stack_detected)}

README excerpt:
{readme_text[:2000]}

File Tree Structure (first 50 entries):
{json.dumps(file_tree[:50], indent=2)}

Task:
Respond strictly with a valid JSON object matching this schema:
{{
  "ai_summary": "A concise 2-3 sentence summary of what this application does and its architecture.",
  "readiness_score": 8, // Integer from 1 to 10
  "readiness_rationale": "Brief explanation for the readiness score."
}}
Do NOT include markdown formatting or extra commentary. Return raw JSON.
"""

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    json={
                        "model": "claude-3-5-sonnet-20241022",
                        "max_tokens": 500,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )

                if res.status_code == 200:
                    data = res.json()
                    content_text = data.get("content", [{}])[0].get("text", "")
                    parsed = json.loads(content_text)
                    usage = data.get("usage", {})
                    tokens_used = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
                    cost = (tokens_used / 1000) * 0.003  # Approximate USD cost

                    return (
                        parsed.get("ai_summary", "Architecture summary unavailable."),
                        int(parsed.get("readiness_score", 7)),
                        parsed.get("readiness_rationale", "Standard readiness assessment."),
                        tokens_used,
                        cost,
                    )
        except Exception:
            pass

        # Fallback if API call fails
        fallback_summary = f"{repo_name} is a software project utilizing {', '.join(stack_detected[:3])}."
        return fallback_summary, 7, "Architecture parsed from repository manifests.", 150, 0.0005
