from __future__ import annotations
import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient


def test_get_slots_returns_available_slots(client):
    """All 5 seeded slots should be returned for a future date with no bookings."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.get(f"/slots?date={tomorrow}")
    assert response.status_code == 200
    data = response.json()
    assert data["date_available"] is True
    assert set(data["slots"]) == {"12:00", "13:00", "20:00", "21:00", "21:30"}


def test_get_slots_missing_date_returns_422(client):
    response = client.get("/slots")
    assert response.status_code == 422


def test_get_slots_invalid_date_returns_422(client):
    response = client.get("/slots?date=not-a-date")
    assert response.status_code == 422


def test_get_slots_past_date_returns_422(client):
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    response = client.get(f"/slots?date={yesterday}")
    assert response.status_code == 422


def test_get_slots_full_slot_not_returned(client, test_db):
    """A slot with max_bookings bookings should not appear in results."""
    import sqlite3
    conn = sqlite3.connect(test_db)
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    # Fill slot 12:00 to capacity (4 bookings)
    for _ in range(4):
        conn.execute(
            "INSERT INTO bookings (name, date, time_slot, party_size, status) "
            "VALUES ('Test', ?, '12:00', 2, 'confirmed')",
            (tomorrow,)
        )
    conn.commit()
    conn.close()

    response = client.get(f"/slots?date={tomorrow}")
    assert response.status_code == 200
    data = response.json()
    assert "12:00" not in data["slots"]
    assert data["date_available"] is True  # other slots still available


def test_rate_limit_returns_429_after_threshold(client):
    """GET /slots should return 429 after 30 requests per minute from same IP."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    # Exhaust the 30 req/min limit
    for _ in range(30):
        client.get(f"/slots?date={tomorrow}")
    # 31st request should be rate limited
    response = client.get(f"/slots?date={tomorrow}")
    assert response.status_code == 429
