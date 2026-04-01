from __future__ import annotations
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# API Routes
app.include_router(slots_router)
app.include_router(bookings_router)
app.include_router(webhooks_router)
app.include_router(menu_router)
app.include_router(contact_router)
app.include_router(auth_router)


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}


# Static files - serve frontend build (only if dist exists)
STATIC_DIR = "/app/frontend/dist"
if os.path.exists(STATIC_DIR):
    app.mount("/_next", StaticFiles(directory=os.path.join(STATIC_DIR, "_next")), name="next-static")
    app.mount("/images", StaticFiles(directory=os.path.join(STATIC_DIR, "images")), name="images")
    
    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_spa(path: str):
        file_path = os.path.join(STATIC_DIR, path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
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
