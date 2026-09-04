from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_embed_success():
    response = client.post(
        "/embed",
        json={"tags": ["Backend", "DevOps", "AWS"], "bio": "Senior Cloud Architect"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "embedding" in data
    assert len(data["embedding"]) == 1024
    assert data["dimension"] == 1024
    assert "Backend" in data["text_processed"]


def test_embed_distinct_texts():
    res1 = client.post(
        "/embed",
        json={"tags": ["Backend", "DevOps", "AWS"]},
    )
    res2 = client.post(
        "/embed",
        json={"tags": ["Marketing", "Sales", "Content"]},
    )
    vec1 = res1.json()["embedding"]
    vec2 = res2.json()["embedding"]

    assert vec1 != vec2, "Vectors for fundamentally distinct texts must not be identical"


def test_embed_empty_payload_fails():
    response = client.post("/embed", json={})
    assert response.status_code == 400
