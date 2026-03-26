from __future__ import annotations
import os
import logging
import smtplib
from typing import Optional
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def _get_smtp_config() -> Optional[dict]:
    """Get SMTP configuration from environment. Returns None if not configured."""
    restaurant_email = os.environ.get("RESTAURANT_EMAIL")
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASS")

    if not all([restaurant_email, smtp_host, smtp_user, smtp_pass]):
        return None

    return {
        "restaurant_email": restaurant_email,
        "smtp_host": smtp_host,
        "smtp_user": smtp_user,
        "smtp_pass": smtp_pass,
        "smtp_port": int(os.environ.get("SMTP_PORT", "587")),
    }


def send_notification(booking: dict) -> None:
    """Send email notification to restaurant. Non-blocking — logs on failure."""
    config = _get_smtp_config()
    if config is None:
        logger.info("Email not configured — skipping notification for booking %s", booking.get("id"))
        return

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Nuova prenotazione — {booking['date']} alle {booking['time_slot']}"
        msg["From"] = config["smtp_user"]
        msg["To"] = config["restaurant_email"]
        msg.set_content(
            f"Nuova prenotazione ricevuta:\n\n"
            f"Nome: {booking['name']}\n"
            f"Telefono: {booking.get('phone', 'non fornito')}\n"
            f"Data: {booking['date']}\n"
            f"Orario: {booking['time_slot']}\n"
            f"Coperti: {booking['party_size']}\n"
        )
        with smtplib.SMTP(config["smtp_host"], config["smtp_port"], timeout=10) as server:
            server.starttls()
            server.login(config["smtp_user"], config["smtp_pass"])
            server.send_message(msg)
        logger.info("Notification sent for booking %s", booking.get("id"))
    except Exception as exc:
        logger.error("Failed to send notification for booking %s: %s", booking.get("id"), exc)


def send_contact_notification(contact: dict) -> None:
    """Send contact form notification to restaurant. Non-blocking — logs on failure."""
    config = _get_smtp_config()
    if config is None:
        logger.info("Email not configured — skipping contact notification %s", contact.get("id"))
        return

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Nuovo messaggio di contatto — {contact['subject'][:50]}"
        msg["From"] = config["smtp_user"]
        msg["To"] = config["restaurant_email"]
        msg.set_content(
            f"Nuovo messaggio di contatto ricevuto:\n\n"
            f"Da: {contact['name']} <{contact['email']}>\n"
            f"Oggetto: {contact['subject']}\n"
            f"Messaggio:\n{contact['message']}\n"
        )
        with smtplib.SMTP(config["smtp_host"], config["smtp_port"], timeout=10) as server:
            server.starttls()
            server.login(config["smtp_user"], config["smtp_pass"])
            server.send_message(msg)
        logger.info("Contact notification sent for message %s", contact.get("id"))
    except Exception as exc:
        logger.error("Failed to send contact notification for message %s: %s", contact.get("id"), exc)
