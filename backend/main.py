import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from database import init_db
from limiter import limiter
from routes.bookings import router as bookings_router
from routes.slots import router as slots_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(title="Osteria Bellavista API", lifespan=lifespan)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Routes
app.include_router(slots_router)
app.include_router(bookings_router)


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}
