from __future__ import annotations
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from database import init_db
from limiter import limiter
from routes.bookings import router as bookings_router
from routes.contact import router as contact_router
from routes.slots import router as slots_router
from routes.webhooks import router as webhooks_router
from routes.menu import router as menu_router
from routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(
    title="Osteria Bellavista API",
    description="Restaurant booking system, menu gallery, and contact form API",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

# Routes
app.include_router(slots_router)
app.include_router(bookings_router)
app.include_router(webhooks_router)
app.include_router(menu_router)
app.include_router(contact_router)
app.include_router(auth_router)


@app.get("/")
def root():
    """Root endpoint with API info."""
    return {
        "name": "Osteria Bellavista API",
        "version": "1.0.0",
        "description": "Restaurant booking system, menu gallery, and contact form API",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "menu": "/menu",
            "bookings": "/bookings",
            "slots": "/slots",
            "contact": "/contact"
        },
        "status": "operational"
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}
