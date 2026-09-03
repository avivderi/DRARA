from typing import List
from pydantic import BaseModel, Field


class EmbeddingRequest(BaseModel):
    text: str = Field(..., description="Text or tags to generate 1024-dim embedding vector for")


class EmbeddingResponse(BaseModel):
    embedding: List[float] = Field(..., description="1024-dimensional normalized vector array")
    dimensions: int = Field(1024, description="Vector dimension size")
    tokens_used: int = Field(0, description="Token count for embedding generation")
