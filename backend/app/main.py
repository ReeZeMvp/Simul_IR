from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import bareme

app = FastAPI(
    title="SimulIR API",
    description="API barèmes fiscaux français — SimulIR 2026",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(bareme.router)


@app.get("/health", tags=["infra"])
def health():
    return {"status": "ok", "service": "simulir-backend"}


@app.get("/", tags=["infra"])
def root():
    return {
        "service": "SimulIR API",
        "docs": "/api/docs",
        "endpoints": [
            "GET /api/bareme/{annee}",
            "GET /api/bareme/{annee}/tranches",
            "GET /api/config/apl",
            "GET /api/config/constantes",
            "GET /health",
        ],
    }
