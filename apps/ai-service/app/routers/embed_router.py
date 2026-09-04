from fastapi import APIRouter, HTTPException

from app.models.embed import EmbedRequest, EmbedResponse
from app.services.embedding_service import get_embedding

router = APIRouter(tags=["Embeddings"])


@router.post("/embed", response_model=EmbedResponse)
async def create_embedding(req: EmbedRequest):
    parts = []
    if req.text and req.text.strip():
        parts.append(req.text.strip())
    if req.tags:
        parts.append("Tags: " + ", ".join(t.strip() for t in req.tags if t.strip()))
    if req.bio and req.bio.strip():
        parts.append("Bio/Details: " + req.bio.strip())

    combined_text = " | ".join(parts).strip()

    if not combined_text:
        raise HTTPException(
            status_code=400,
            detail="Must provide non-empty text, tags, or bio for embedding generation",
        )

    vector = get_embedding(combined_text, req.input_type)

    return EmbedResponse(
        embedding=vector,
        dimension=len(vector),
        text_processed=combined_text,
    )
