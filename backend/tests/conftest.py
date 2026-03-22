import os
import pytest
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def test_db(tmp_path, monkeypatch):
    """Create a fresh SQLite DB for each test in a temp directory."""
    db_path = str(tmp_path / "test.db")
    monkeypatch.setenv("DATABASE_PATH", db_path)
    from database import init_db
    init_db()
    # Reset rate limiter storage so each test starts with a clean slate
    from limiter import limiter
    limiter._storage.reset()
    yield db_path


@pytest.fixture
def client(test_db):
    from main import app
    return TestClient(app)
