import os
import logging
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def send_notification(booking: dict) -> None:
    """Send email notification to restaurant. Non-blocking — logs on failure."""
    restaurant_email = os.environ.get("RESTAURANT_EMAIL")
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASS")

    if not all([restaurant_email, smtp_host, smtp_user, smtp_pass]):
        logger.info("Email not configured — skipping notification for booking %s", booking.get("id"))
        return

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Nuova prenotazione — {booking['date']} alle {booking['time_slot']}"
        msg["From"] = smtp_user
        msg["To"] = restaurant_email
        msg.set_content(
            f"Nuova prenotazione ricevuta:\n\n"
            f"Nome: {booking['name']}\n"
            f"Telefono: {booking.get('phone', 'non fornito')}\n"
            f"Data: {booking['date']}\n"
            f"Orario: {booking['time_slot']}\n"
            f"Coperti: {booking['party_size']}\n"
        )
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        logger.info("Notification sent for booking %s", booking.get("id"))
    except Exception as exc:
        logger.error("Failed to send notification for booking %s: %s", booking.get("id"), exc)
