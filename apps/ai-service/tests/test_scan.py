import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.stack_detector import HeuristicStackDetector

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "drara-ai-service"


def test_scan_repository_endpoint():
    payload = {
        "github_repo_full_name": "avivderi/DRARA",
        "installation_id": "test_inst_123",
        "installation_token": "test_token",
        "force": True,
    }
    response = client.post("/scan", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "ai_summary" in data
    assert isinstance(data["stack_detected"], list)
    assert 1 <= data["readiness_score"] <= 10
    assert "readiness_rationale" in data
    assert "TypeScript" in data["stack_detected"]
    assert "Node.js" in data["stack_detected"]


def test_heuristic_stack_detector():
    tree = [
        "package.json",
        "docker-compose.yml",
        "src/index.ts",
        "app/page.tsx",
    ]
    manifests = {
        "package.json": '{"dependencies": {"express": "^4.19.2", "next": "14.2.0", "knex": "^3.1.0", "redis": "^4.6.0"}}',
        "docker-compose.yml": "services:\n  postgres:\n    image: postgres:16-alpine",
    }
    stack = HeuristicStackDetector.detect_from_tree_and_files(tree, manifests)

    assert "TypeScript" in stack
    assert "Node.js" in stack
    assert "Next.js" in stack
    assert "Express" in stack
    assert "PostgreSQL" in stack
    assert "Redis" in stack
    assert "Docker" in stack
