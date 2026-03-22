import pytest
import sqlite3
from datetime import date, timedelta


def test_create_booking_success(client):
    """POST /bookings with valid data returns 201 and booking details."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload = {
        "name": "Mario Rossi",
        "phone": "+41 91 123 45 67",
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 2,
    }
    response = client.post("/bookings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Mario Rossi"
    assert data["date"] == tomorrow
    assert data["time_slot"] == "20:00"
    assert data["party_size"] == 2
    assert data["status"] == "confirmed"
    assert "id" in data


def test_create_booking_without_phone(client):
    """Phone is optional."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "Anna Verdi",
        "date": tomorrow,
        "time_slot": "12:00",
        "party_size": 1,
    })
    assert response.status_code == 201


def test_create_booking_invalid_slot_returns_422(client):
    """Booking for a slot not in slots_config returns 422."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "Test",
        "date": tomorrow,
        "time_slot": "15:00",  # not in seed data
        "party_size": 2,
    })
    assert response.status_code == 422


def test_create_booking_full_slot_returns_409(client, test_db):
    """Booking a slot already at capacity returns 409."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    conn = sqlite3.connect(test_db)
    for _ in range(4):
        conn.execute(
            "INSERT INTO bookings (name, date, time_slot, party_size, status) "
            "VALUES ('Existing', ?, '20:00', 2, 'confirmed')",
            (tomorrow,)
        )
    conn.commit()
    conn.close()

    response = client.post("/bookings", json={
        "name": "Latecoming",
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 2,
    })
    assert response.status_code == 409


def test_create_booking_past_date_returns_422(client):
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "Test",
        "date": yesterday,
        "time_slot": "20:00",
        "party_size": 2,
    })
    assert response.status_code == 422


def test_create_booking_party_size_out_of_range_returns_422(client):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "Test",
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 11,
    })
    assert response.status_code == 422


def test_create_booking_name_too_long_returns_422(client):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "A" * 101,
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 2,
    })
    assert response.status_code == 422


def test_rate_limit_bookings_returns_429(client):
    """POST /bookings rate limit: max 5 per minute."""
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload = {
        "name": "Tester",
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 1,
    }
    for _ in range(5):
        client.post("/bookings", json=payload)
    response = client.post("/bookings", json=payload)
    assert response.status_code == 429
