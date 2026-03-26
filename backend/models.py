from __future__ import annotations
from datetime import date
from enum import Enum
import re
from typing import List, Optional, Union
from pydantic import BaseModel, EmailStr, field_validator


class BookingCreate(BaseModel):
    """Input model for creating a booking."""

    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    date: date
    time_slot: str
    party_size: int
    table_preference: str = "nessuna"
    notes: Optional[str] = None
    
    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        """Validate email format if provided."""
        if v is None or v == "":
            return None
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("invalid email format")
        return v

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
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
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
        import os
        from zoneinfo import ZoneInfo
        from datetime import datetime as dt
        tz = ZoneInfo(os.environ.get("RESTAURANT_TZ", "Europe/Rome"))
        today_local = dt.now(tz).date()
        if v < today_local:
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
    slots: List[str]


class BookingResponse(BaseModel):
    """Response model for a confirmed booking."""

    id: int
    name: str
    email: Optional[str] = None
    date: str
    time_slot: str
    party_size: int
    table_preference: str = "nessuna"
    notes: Optional[str] = None
    status: str


# --- Menu Gallery Models ---

class MenuCategory(str, Enum):
    """Menu item categories."""
    ANTIPASTI = "antipasti"
    PRIMI = "primi"
    SECONDI = "secondi"
    CONTORNI = "contorni"
    DOLCI = "dolci"
    BEVANDE = "bevande"


class MenuItemBase(BaseModel):
    """Base model for menu items."""
    name: str
    description: Optional[str] = None
    price: float
    category: MenuCategory
    image_url: Optional[str] = None
    is_available: bool = True

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

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        """Enforce max 500 characters if provided."""
        if v is not None:
            v = v.strip()
            if len(v) > 500:
                raise ValueError("description must be at most 500 characters")
        return v

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: float) -> float:
        """Enforce non-negative price with max 9999.99."""
        if v < 0:
            raise ValueError("price must not be negative")
        if v > 9999.99:
            raise ValueError("price exceeds maximum allowed")
        # Round to 2 decimal places
        return round(v, 2)


class MenuItemCreate(MenuItemBase):
    """Input model for creating a menu item."""
    pass


class MenuItemResponse(MenuItemBase):
    """Response model for a menu item."""
    id: int
    created_at: Optional[str] = None


class MenuCategoryResponse(BaseModel):
    """Response model for menu categories."""
    categories: List[dict]


# --- Contact Form Models ---

class ContactFormCreate(BaseModel):
    """Input model for contact form submissions."""
    name: str
    email: EmailStr
    subject: str
    message: str

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

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        """Strip whitespace and enforce max 200 characters."""
        v = v.strip()
        if not v:
            raise ValueError("subject must not be empty")
        if len(v) > 200:
            raise ValueError("subject must be at most 200 characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        """Strip whitespace and enforce max 2000 characters."""
        v = v.strip()
        if not v:
            raise ValueError("message must not be empty")
        if len(v) > 2000:
            raise ValueError("message must be at most 2000 characters")
        return v


class ContactFormResponse(BaseModel):
    """Response model for a contact form submission."""
    id: int
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: Optional[str] = None


# --- Authentication Models ---

class AdminLogin(BaseModel):
    """Input model for admin login."""
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Strip whitespace and enforce non-empty."""
        v = v.strip()
        if not v:
            raise ValueError("username must not be empty")
        return v


class TokenResponse(BaseModel):
    """Response model for JWT token."""
    access_token: str
    token_type: str = "bearer"


class AdminUser(BaseModel):
    """Model for admin user data."""
    username: str
    role: str = "admin"


class ContactCreate(BaseModel):
    """Input model for creating a contact message."""

    name: str
    email: str
    subject: str
    message: str

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

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        v = v.strip().lower()
        if not v:
            raise ValueError("email must not be empty")
        # Basic email regex pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError("invalid email format")
        if len(v) > 254:
            raise ValueError("email must be at most 254 characters")
        return v

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        """Strip whitespace and enforce max 200 characters."""
        v = v.strip()
        if not v:
            raise ValueError("subject must not be empty")
        if len(v) > 200:
            raise ValueError("subject must be at most 200 characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        """Strip whitespace and enforce max 2000 characters."""
        v = v.strip()
        if not v:
            raise ValueError("message must not be empty")
        if len(v) > 2000:
            raise ValueError("message must be at most 2000 characters")
        return v


class ContactResponse(BaseModel):
    """Response model for a contact message submission."""

    id: int
    status: str
    message: str
