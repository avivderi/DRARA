from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.services.embedding_service import EmbeddingService

client = TestClient(app)


def test_embed_endpoint_returns_1024_dims():
    response = client.post("/embed", json={"text": "Backend, DevOps, AWS"})
    assert response.status_code == 200
    data = response.json()

    assert "embedding" in data
    assert len(data["embedding"]) == 1024
    assert data["dimensions"] == 1024
    assert data["tokens_used"] > 0


@pytest.mark.anyio
async def test_embedding_service_semantic_distance():
    service = EmbeddingService()
    vec_backend, _ = await service.generate_embedding("Backend, DevOps, AWS")
    vec_marketing, _ = await service.generate_embedding("Marketing, Sales, Content")

    assert len(vec_backend) == 1024
    assert len(vec_marketing) == 1024
    # Ensure vectors are distinct
    assert vec_backend != vec_marketing
