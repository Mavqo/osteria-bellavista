"""Webhook handlers for n8n automation integration.

This module provides webhook endpoints for:
- Receiving notifications from n8n workflows
- Handling retry logic for failed operations
- Webhook signature verification for security
"""

import os
import hmac
import hashlib
import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Header, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# Webhook configuration
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
N8N_WEBHOOK_URL = os.environ.get("N8N_WEBHOOK_URL", "")


class WebhookPayload(BaseModel):
    """Base webhook payload model."""
    event: str
    data: dict[str, Any]
    timestamp: str | None = None


class RetryPayload(BaseModel):
    """Payload for retry requests."""
    workflow: str
    originalData: dict[str, Any]
    retryCount: int = 0


class BookingNotificationPayload(BaseModel):
    """Payload for booking notifications."""
    booking_id: int
    name: str
    email: str | None = None
    phone: str | None = None
    date: str
    time_slot: str
    party_size: int
    status: str
    notes: str | None = None


def verify_webhook_signature(payload: bytes, signature: str | None, secret: str) -> bool:
    """Verify webhook signature using HMAC-SHA256.
    
    Args:
        payload: Raw request body bytes
        signature: Signature header value (hex-encoded)
        secret: Webhook secret for verification
        
    Returns:
        True if signature is valid, False otherwise
    """
    if not secret or not signature:
        return False
    
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)


@router.post("/webhooks/booking-notification", status_code=200)
async def booking_notification(
    payload: BookingNotificationPayload,
    request: Request,
    x_webhook_signature: str | None = Header(None, alias="X-Webhook-Signature"),
) -> dict:
    """Receive booking notifications from n8n workflow.
    
    This endpoint is called by n8n after a booking is created
    to trigger additional automations like customer emails.
    
    Args:
        payload: Booking notification data
        request: FastAPI request object
        x_webhook_signature: Optional signature for verification
        
    Returns:
        Success confirmation
        
    Raises:
        HTTPException: If signature verification fails
    """
    # Verify signature if secret is configured
    if WEBHOOK_SECRET:
        body = await request.body()
        if not verify_webhook_signature(body, x_webhook_signature, WEBHOOK_SECRET):
            logger.warning("Invalid webhook signature for booking notification")
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    logger.info(
        "Received booking notification for booking %s (%s)",
        payload.booking_id,
        payload.name
    )
    
    # Here you could trigger additional actions:
    # - Send SMS via Twilio
    # - Add to CRM
    # - Create calendar event
    # - Update analytics
    
    return {
        "success": True,
        "message": "Notification received",
        "booking_id": payload.booking_id
    }


@router.post("/webhooks/retry", status_code=200)
async def handle_retry(
    payload: RetryPayload,
    request: Request,
    x_webhook_signature: str | None = Header(None, alias="X-Webhook-Signature"),
) -> dict:
    """Handle retry requests from error handler workflow.
    
    This endpoint receives retry requests when a workflow fails
    and needs to be retried with exponential backoff.
    
    Args:
        payload: Retry payload with workflow details
        request: FastAPI request object
        x_webhook_signature: Optional signature for verification
        
    Returns:
        Retry status
    """
    # Verify signature if secret is configured
    if WEBHOOK_SECRET:
        body = await request.body()
        if not verify_webhook_signature(body, x_webhook_signature, WEBHOOK_SECRET):
            logger.warning("Invalid webhook signature for retry request")
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    logger.info(
        "Handling retry for workflow '%s' (attempt %d)",
        payload.workflow,
        payload.retryCount
    )
    
    # Route to appropriate handler based on workflow type
    result = await _route_retry(payload)
    
    return {
        "success": result,
        "workflow": payload.workflow,
        "retryCount": payload.retryCount
    }


async def _route_retry(payload: RetryPayload) -> bool:
    """Route retry to appropriate handler.
    
    Args:
        payload: Retry payload
        
    Returns:
        True if retry succeeded, False otherwise
    """
    workflow = payload.workflow
    data = payload.originalData
    
    try:
        if workflow == "booking-confirmation":
            return await _retry_booking(data)
        elif workflow == "contact-form":
            return await _retry_contact(data)
        else:
            logger.warning("Unknown workflow for retry: %s", workflow)
            return False
    except Exception as e:
        logger.error("Retry failed for %s: %s", workflow, e)
        return False


async def _retry_booking(data: dict[str, Any]) -> bool:
    """Retry a failed booking creation.
    
    Args:
        data: Original booking data
        
    Returns:
        True if retry succeeded
    """
    from database import get_db
    
    try:
        with get_db() as conn:
            conn.execute("BEGIN IMMEDIATE")
            
            # Check if slot is still available
            slot = conn.execute(
                "SELECT max_bookings FROM slots_config WHERE time_slot = ? AND is_active = 1",
                (data.get("time_slot"),),
            ).fetchone()
            
            if not slot:
                logger.error("Slot not available for retry")
                return False
            
            count = conn.execute(
                "SELECT COUNT(*) FROM bookings WHERE date = ? AND time_slot = ? AND status = 'confirmed'",
                (data.get("date"), data.get("time_slot")),
            ).fetchone()[0]
            
            if count >= slot["max_bookings"]:
                logger.error("Slot fully booked for retry")
                return False
            
            # Insert booking
            cursor = conn.execute(
                "INSERT INTO bookings (name, phone, date, time_slot, party_size, status, email, notes) "
                "VALUES (?, ?, ?, ?, ?, 'confirmed', ?, ?)",
                (
                    data.get("name"),
                    data.get("phone"),
                    data.get("date"),
                    data.get("time_slot"),
                    data.get("party_size", 2),
                    data.get("email"),
                    data.get("notes"),
                ),
            )
            
            logger.info("Retry succeeded for booking, ID: %s", cursor.lastrowid)
            return True
            
    except Exception as e:
        logger.error("Booking retry failed: %s", e)
        return False


async def _retry_contact(data: dict[str, Any]) -> bool:
    """Retry a failed contact form submission.
    
    Args:
        data: Original contact form data
        
    Returns:
        True if retry succeeded (always returns True as contact form is stateless)
    """
    # Contact form submissions are typically stateless
    # Retry would just re-send the notification
    logger.info("Retrying contact form for: %s", data.get("email"))
    return True


@router.post("/webhooks/signature-test", status_code=200)
async def test_signature(
    request: Request,
    x_webhook_signature: str | None = Header(None, alias="X-Webhook-Signature"),
) -> dict:
    """Test endpoint for webhook signature verification.
    
    Args:
        request: FastAPI request object
        x_webhook_signature: Signature to verify
        
    Returns:
        Verification result
    """
    body = await request.body()
    
    if not WEBHOOK_SECRET:
        return {
            "verified": False,
            "reason": "WEBHOOK_SECRET not configured"
        }
    
    if not x_webhook_signature:
        return {
            "verified": False,
            "reason": "No signature provided"
        }
    
    is_valid = verify_webhook_signature(body, x_webhook_signature, WEBHOOK_SECRET)
    
    return {
        "verified": is_valid,
        "signature_received": x_webhook_signature[:20] + "..." if x_webhook_signature else None,
        "body_length": len(body)
    }


@router.get("/webhooks/health", status_code=200)
async def webhooks_health() -> dict:
    """Health check for webhook system.
    
    Returns:
        Webhook system status
    """
    return {
        "status": "ok",
        "webhook_secret_configured": bool(WEBHOOK_SECRET),
        "n8n_url_configured": bool(N8N_WEBHOOK_URL),
    }
