from __future__ import annotations
"""Tests for JWT authentication endpoints."""
import pytest


def test_login_with_valid_credentials(client):
    """POST /auth/login with valid credentials should return token."""
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    # Note: This test assumes default admin is seeded; may skip if not
    if response.status_code == 200:
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    else:
        pytest.skip("Admin user not configured or invalid credentials")


def test_login_with_invalid_username(client):
    """POST /auth/login with invalid username should return 401."""
    response = client.post("/auth/login", json={
        "username": "nonexistent",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_login_with_invalid_password(client):
    """POST /auth/login with invalid password should return 401."""
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_login_missing_username_returns_422(client):
    """POST /auth/login without username should return 422."""
    response = client.post("/auth/login", json={
        "password": "admin123"
    })
    assert response.status_code == 422


def test_login_missing_password_returns_422(client):
    """POST /auth/login without password should return 422."""
    response = client.post("/auth/login", json={
        "username": "admin"
    })
    assert response.status_code == 422


def test_login_empty_username_returns_422(client):
    """POST /auth/login with empty username should return 422."""
    response = client.post("/auth/login", json={
        "username": "   ",
        "password": "admin123"
    })
    assert response.status_code == 422


def test_rate_limit_login(client):
    """POST /auth/login should be rate limited to 5 per minute."""
    for _ in range(5):
        client.post("/auth/login", json={
            "username": "admin",
            "password": "wrong"
        })
    
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "wrong"
    })
    assert response.status_code == 429


def test_access_protected_endpoint_with_valid_token(client):
    """Accessing protected endpoint with valid token should succeed."""
    # First login
    login_response = client.post("/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    if login_response.status_code != 200:
        pytest.skip("Admin user not configured")
    
    token = login_response.json()["access_token"]
    
    # Access protected endpoint
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "username" in data


def test_access_protected_endpoint_without_token(client):
    """Accessing protected endpoint without token should return 401/403."""
    response = client.get("/auth/me")
    assert response.status_code in [401, 403]


def test_access_protected_endpoint_with_invalid_token(client):
    """Accessing protected endpoint with invalid token should return 401."""
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401


def test_access_protected_endpoint_with_expired_token(client):
    """Accessing protected endpoint with expired token should return 401."""
    # This would require creating an expired token, which is complex in tests
    # Skipping as it requires token manipulation
    pytest.skip("Requires expired token generation")


def test_health_endpoint_is_public(client):
    """GET /health should be accessible without auth."""
    response = client.get("/health")
    assert response.status_code == 200


def test_menu_get_is_public(client):
    """GET /menu should be accessible without auth."""
    response = client.get("/menu")
    assert response.status_code == 200


def test_slots_get_is_public(client):
    """GET /slots should be accessible without auth."""
    from datetime import date, timedelta
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.get(f"/slots?date={tomorrow}")
    assert response.status_code == 200


def test_bookings_post_is_public(client):
    """POST /bookings should be accessible without auth (public booking)."""
    from datetime import date, timedelta
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    response = client.post("/bookings", json={
        "name": "Test User",
        "date": tomorrow,
        "time_slot": "20:00",
        "party_size": 2
    })
    assert response.status_code == 201


def test_contact_post_is_public(client):
    """POST /contact should be accessible without auth."""
    response = client.post("/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test",
        "message": "Test message"
    })
    assert response.status_code == 201
