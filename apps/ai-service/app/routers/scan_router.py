from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.scan import ScanRequest, ScanResponse
from app.services.ai_summarizer import AISummarizerService
from app.services.github_service import FakeGitHubService, GitHubService
from app.services.stack_detector import HeuristicStackDetector

router = APIRouter(prefix="", tags=["Scan"])


@router.post("/scan", response_model=ScanResponse)
async def scan_repository(req: ScanRequest) -> ScanResponse:
    if not settings.github_ai_scan_enabled:
        raise HTTPException(
            status_code=400,
            detail="GITHUB_AI_SCAN_DISABLED: AI scanning feature is currently disabled by configuration.",
        )

    # Use FakeGitHubService if installation_token starts with 'test' or in test mode
    if req.installation_token == "test_token" or req.installation_id.startswith("test"):
        github_svc = FakeGitHubService()
    else:
        github_svc = GitHubService(token=req.installation_token or "")

    readme_text, file_tree, manifest_contents = await github_svc.fetch_repo_architecture(
        req.github_repo_full_name
    )

    stack_detected = HeuristicStackDetector.detect_from_tree_and_files(file_tree, manifest_contents)

    ai_svc = AISummarizerService()
    summary, score, rationale, tokens_used, cost = await ai_svc.summarize_architecture(
        repo_name=req.github_repo_full_name,
        readme_text=readme_text,
        file_tree=file_tree,
        stack_detected=stack_detected,
    )

    return ScanResponse(
        ai_summary=summary,
        stack_detected=stack_detected,
        readiness_score=score,
        readiness_rationale=rationale,
        tokens_used=tokens_used,
        estimated_cost_usd=cost,
    )
