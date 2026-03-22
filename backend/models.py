from datetime import date
import re
from pydantic import BaseModel, field_validator


class BookingCreate(BaseModel):
    """Input model for creating a booking."""

    name: str
    phone: str | None = None
    date: date
    time_slot: str
    party_size: int

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Strip whitespace and enforce max 100 characters."""
        v = v.strip()
        if not v:
            raise ValueError("name must not be empty")
        if len(v) > 100:
            raise ValueError("name must be at most 100 characters")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        """Allow None; otherwise enforce digits/+/spaces/dashes and 7–15 digit count."""
        if v is None:
            return v
        if not re.match(r'^[\d+\s\-]+$', v):
            raise ValueError("phone contains invalid characters")
        digits = re.sub(r'[^\d]', '', v)
        if len(digits) < 7:
            raise ValueError("phone must have at least 7 digits")
        if len(digits) > 15:
            raise ValueError("phone must have at most 15 digits")
        return v

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        """Reject past dates."""
        if v < date.today():
            raise ValueError("date must not be in the past")
        return v

    @field_validator("time_slot")
    @classmethod
    def validate_time_slot(cls, v: str) -> str:
        """Enforce HH:MM format for time_slot."""
        if not re.match(r'^\d{2}:\d{2}$', v):
            raise ValueError("time_slot must be in HH:MM format")
        return v

    @field_validator("party_size")
    @classmethod
    def validate_party_size(cls, v: int) -> int:
        """Enforce party size between 1 and 10 inclusive."""
        if v < 1 or v > 10:
            raise ValueError("party_size must be between 1 and 10")
        return v


class SlotsResponse(BaseModel):
    """Response model for GET /slots."""

    date_available: bool
    slots: list[str]


class BookingResponse(BaseModel):
    """Response model for a confirmed booking."""

    id: int
    name: str
    date: str
    time_slot: str
    party_size: int
    status: str
