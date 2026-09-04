from typing import List, Optional
from pydantic import BaseModel, Field


class EmbedRequest(BaseModel):
    text: Optional[str] = Field(None, description="Raw text string to embed")
    tags: Optional[List[str]] = Field(default=[], description="List of skill/domain tags")
    bio: Optional[str] = Field(None, description="Optional bio or description")
    input_type: Optional[str] = Field(None, description="Voyage AI input_type: 'query' or 'document'")


class EmbedResponse(BaseModel):
    embedding: List[float] = Field(..., description="1024-dimensional normalized embedding vector")
    dimension: int = Field(1024, description="Vector dimension size")
    text_processed: str = Field(..., description="Concatenated text string submitted to Voyage AI")
