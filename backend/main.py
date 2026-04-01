import os
import glob
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


# Debug: lista file nel filesystem
@app.get("/debug/files")
def debug_files():
    """Debug endpoint to check filesystem."""
    result = {"cwd": os.getcwd(), "files": {}}
    for root, dirs, files in os.walk("/app"):
        level = root.replace("/app", "").count(os.sep)
        indent = " " * 2 * level
        result["files"][root] = files[:20]  # max 20 files per dir
        if level > 2:  # limit depth
            break
    return result


# Static files - serve frontend build
STATIC_DIR = "/app/frontend/dist"
print(f"DEBUG: Checking STATIC_DIR: {STATIC_DIR}")
print(f"DEBUG: Exists: {os.path.exists(STATIC_DIR)}")

if os.path.exists(STATIC_DIR):
    print(f"DEBUG: STATIC_DIR exists, mounting static files")
    # List files in dist
    files = glob.glob(os.path.join(STATIC_DIR, "*"))
    print(f"DEBUG: Files in {STATIC_DIR}: {files}")
    
    app.mount("/_next", StaticFiles(directory=os.path.join(STATIC_DIR, "_next")), name="next-static")
    
    @app.get("/")
    async def serve_root():
        index_path = os.path.join(STATIC_DIR, "index.html")
        print(f"DEBUG: Serving root, index_path: {index_path}, exists: {os.path.exists(index_path)}")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "index.html not found", "path": index_path}
    
    @app.get("/{path:path}")
    async def serve_spa(path: str):
        file_path = os.path.join(STATIC_DIR, path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    print(f"DEBUG: STATIC_DIR does not exist, serving API info")
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
