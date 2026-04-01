from __future__ import annotations
"""Tests for contact form API."""

import pytest


class TestContactCreate:
    """Tests for POST /contact endpoint."""

    def test_create_contact_success(self, client):
        """POST /contact with valid data returns 201 and contact details."""
        payload = {
            "name": "Mario Rossi",
            "email": "mario.rossi@example.com",
            "subject": "Question about reservations",
            "message": "I would like to know if you accommodate dietary restrictions.",
        }
        response = client.post("/contact", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "received"
        assert "id" in data
        assert "Thank you" in data["message"]

    def test_create_contact_name_validation(self, client):
        """Name must not be empty and max 100 chars."""
        # Empty name
        response = client.post("/contact", json={
            "name": "",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test message",
        })
        assert response.status_code == 422

        # Name too long (>100 chars)
        response = client.post("/contact", json={
            "name": "A" * 101,
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test message",
        })
        assert response.status_code == 422

    def test_create_contact_email_validation(self, client):
        """Email must be valid format."""
        # Invalid email format
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "invalid-email",
            "subject": "Test",
            "message": "Test message",
        })
        assert response.status_code == 422

        # Empty email
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "",
            "subject": "Test",
            "message": "Test message",
        })
        assert response.status_code == 422

        # Email too long (>254 chars)
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "a" * 250 + "@test.com",
            "subject": "Test",
            "message": "Test message",
        })
        assert response.status_code == 422

    def test_create_contact_subject_validation(self, client):
        """Subject must not be empty and max 200 chars."""
        # Empty subject
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "",
            "message": "Test message",
        })
        assert response.status_code == 422

        # Subject too long (>200 chars)
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "A" * 201,
            "message": "Test message",
        })
        assert response.status_code == 422

    def test_create_contact_message_validation(self, client):
        """Message must not be empty and max 2000 chars."""
        # Empty message
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "",
        })
        assert response.status_code == 422

        # Message too long (>2000 chars)
        response = client.post("/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "A" * 2001,
        })
        assert response.status_code == 422

    def test_create_contact_whitespace_stripping(self, client):
        """Whitespace should be stripped from inputs."""
        payload = {
            "name": "  Mario Rossi  ",
            "email": "  MARIO.ROSSI@EXAMPLE.COM  ",
            "subject": "  Test Subject  ",
            "message": "  Test message content  ",
        }
        response = client.post("/contact", json=payload)
        assert response.status_code == 201
        # Email should be lowercased
        data = response.json()
        assert data["status"] == "received"

    def test_rate_limit_contact_returns_429(self, client):
        """POST /contact rate limit: max 3 per minute."""
        payload = {
            "name": "Tester",
            "email": "test@example.com",
            "subject": "Test subject",
            "message": "Test message content",
        }
        # Make 3 requests (the limit)
        for _ in range(3):
            response = client.post("/contact", json=payload)
            assert response.status_code == 201

        # 4th request should be rate limited
        response = client.post("/contact", json=payload)
        assert response.status_code == 429


class TestContactModelValidation:
    """Direct tests for ContactCreate model validation."""

    def test_valid_contact_data(self):
        """Valid contact data should pass validation."""
        from models import ContactCreate

        contact = ContactCreate(
            name="John Doe",
            email="john@example.com",
            subject="Hello",
            message="This is a test message",
        )
        assert contact.name == "John Doe"
        assert contact.email == "john@example.com"

    def test_email_normalization(self):
        """Email should be normalized to lowercase."""
        from models import ContactCreate

        contact = ContactCreate(
            name="John Doe",
            email="JOHN@EXAMPLE.COM",
            subject="Hello",
            message="Test",
        )
        assert contact.email == "john@example.com"
