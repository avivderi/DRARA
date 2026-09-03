from fastapi import APIRouter

from app.models.embedding import EmbeddingRequest, EmbeddingResponse
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="", tags=["Embedding"])


@router.post("/embed", response_model=EmbeddingResponse)
async def create_embedding(req: EmbeddingRequest) -> EmbeddingResponse:
    service = EmbeddingService()
    vector, tokens = await service.generate_embedding(req.text)

    return EmbeddingResponse(
        embedding=vector,
        dimensions=len(vector),
        tokens_used=tokens,
    )
