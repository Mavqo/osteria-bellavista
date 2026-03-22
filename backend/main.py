from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(title="Osteria Bellavista API", lifespan=lifespan)
