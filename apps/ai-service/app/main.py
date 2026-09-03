from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import embedding_router, scan_router

app = FastAPI(
    title="DRARA AI Microservice",
    description="Architecture Summarization, Stack Detection & Embedding API for DRARA Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router.router)
app.include_router(embedding_router.router)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "drara-ai-service",
        "ai_scan_enabled": settings.github_ai_scan_enabled,
    }
