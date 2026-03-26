from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from database import get_db
from email_service import send_contact_notification
from limiter import limiter
from models import ContactCreate, ContactResponse

router = APIRouter()


@router.post("/contact", response_model=ContactResponse, status_code=201)
@limiter.limit("3/minute")
def create_contact(
    request: Request, contact: ContactCreate, background_tasks: BackgroundTasks
) -> ContactResponse:
    """Create a contact message and send email notification."""
    with get_db() as conn:
        # Insert contact message
        cursor = conn.execute(
            "INSERT INTO contact_messages (name, email, subject, message, status) "
            "VALUES (?, ?, ?, ?, 'received')",
            (contact.name, contact.email, contact.subject, contact.message),
        )
        contact_id = cursor.lastrowid

    contact_dict = {
        "id": contact_id,
        "name": contact.name,
        "email": contact.email,
        "subject": contact.subject,
        "message": contact.message,
        "status": "received",
    }

    background_tasks.add_task(send_contact_notification, contact_dict)

    return ContactResponse(
        id=contact_id,
        status="received",
        message="Thank you for your message. We will get back to you soon.",
    )
