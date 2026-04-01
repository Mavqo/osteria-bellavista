from __future__ import annotations
import pytest
from datetime import date, timedelta
from pydantic import ValidationError
from models import BookingCreate, SlotsResponse, BookingResponse


# --- BookingCreate valid cases ---

def test_booking_create_valid_minimal():
    b = BookingCreate(
        name="Mario Rossi",
        date=date.today() + timedelta(days=1),
        time_slot="20:00",
        party_size=2,
    )
    assert b.name == "Mario Rossi"
    assert b.party_size == 2
    assert b.phone is None


def test_booking_create_valid_with_phone():
    b = BookingCreate(
        name="Luigi Bianchi",
        phone="+41 91 123 45 67",
        date=date.today() + timedelta(days=1),
        time_slot="19:30",
        party_size=4,
    )
    assert b.phone == "+41 91 123 45 67"


def test_booking_create_name_is_stripped():
    b = BookingCreate(
        name="  Anna  ",
        date=date.today() + timedelta(days=1),
        time_slot="20:00",
        party_size=1,
    )
    assert b.name == "Anna"


# --- BookingCreate invalid cases ---

def test_booking_create_name_too_long():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="A" * 101,
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_date_in_past():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            date=date.today() - timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_party_size_zero():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=0,
        )


def test_booking_create_party_size_eleven():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=11,
        )


def test_booking_create_phone_too_short():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            phone="123",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_phone_too_long():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            phone="1" * 16,
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_phone_invalid_chars():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            phone="abc123def",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_today_is_valid():
    """Same-day bookings are allowed."""
    from datetime import date
    b = BookingCreate(
        name="Test",
        date=date.today(),
        time_slot="20:00",
        party_size=2,
    )
    assert b.date == date.today()


def test_booking_create_invalid_time_slot_format():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="Test",
            date=date.today() + timedelta(days=1),
            time_slot="dinner",
            party_size=2,
        )


def test_booking_create_name_whitespace_only():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="   ",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


def test_booking_create_name_empty():
    with pytest.raises(ValidationError):
        BookingCreate(
            name="",
            date=date.today() + timedelta(days=1),
            time_slot="20:00",
            party_size=2,
        )


# --- SlotsResponse ---

def test_slots_response_with_slots():
    r = SlotsResponse(date_available=True, slots=["12:00", "20:00"])
    assert r.date_available is True
    assert r.slots == ["12:00", "20:00"]


def test_slots_response_no_availability():
    r = SlotsResponse(date_available=False, slots=[])
    assert r.date_available is False
    assert r.slots == []


# --- BookingResponse ---

def test_booking_response_fields():
    r = BookingResponse(
        id=1,
        name="Mario",
        date="2026-04-01",
        time_slot="20:00",
        party_size=2,
        status="confirmed",
    )
    assert r.id == 1
    assert r.status == "confirmed"
