from typing import Optional
from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    github_repo_full_name: str = Field(..., example="avivderi/DRARA")
    installation_id: str = Field(..., example="inst_12345")
    installation_token: Optional[str] = None
    force: bool = False


class ScanResponse(BaseModel):
    ai_summary: str
    stack_detected: list[str]
    readiness_score: int = Field(..., ge=1, le=10)
    readiness_rationale: str
    tokens_used: int = 0
    estimated_cost_usd: float = 0.0
