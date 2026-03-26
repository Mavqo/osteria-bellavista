"""Contact form routes."""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Annotated

from database import get_db
from limiter import limiter
from models import ContactFormCreate, ContactFormResponse
from auth.jwt import get_current_admin

router = APIRouter()


@router.post("/contact", status_code=201)
@limiter.limit("3/minute")
def create_contact_submission(
    request: Request,
    submission: ContactFormCreate,
) -> dict:
    """Submit a contact form (public endpoint with rate limiting)."""
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO contact_submissions (name, email, subject, message, status)
            VALUES (?, ?, ?, ?, 'new')
            """,
            (
                submission.name,
                submission.email,
                submission.subject,
                submission.message,
            ),
        )
        submission_id = cursor.lastrowid
    
    return {
        "id": submission_id,
        "status": "received",
        "message": "Thank you for your message. We'll get back to you soon!"
    }


@router.get("/contact", response_model=dict)
@limiter.limit("30/minute")
def get_contact_submissions(
    request: Request,
    status_filter: Annotated[str | None, "Filter by status (new, read, replied)"] = None,
    current_user: Annotated[dict, Depends(get_current_admin)] = None,
) -> dict:
    """Get all contact form submissions (admin only)."""
    with get_db() as conn:
        query = """
            SELECT id, name, email, subject, message, status, created_at
            FROM contact_submissions
        """
        params = []
        
        if status_filter:
            query += " WHERE status = ?"
            params.append(status_filter)
        
        query += " ORDER BY created_at DESC"
        
        rows = conn.execute(query, params).fetchall()
        
        submissions = []
        for row in rows:
            submissions.append({
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "subject": row["subject"],
                "message": row["message"],
                "status": row["status"],
                "created_at": row["created_at"],
            })
    
    return {"submissions": submissions}


@router.patch("/contact/{submission_id}", response_model=ContactFormResponse)
@limiter.limit("30/minute")
def update_contact_status(
    request: Request,
    submission_id: int,
    status_update: dict,
    current_user: Annotated[dict, Depends(get_current_admin)] = None,
) -> ContactFormResponse:
    """Update contact submission status (admin only)."""
    new_status = status_update.get("status")
    if not new_status or new_status not in ["new", "read", "replied"]:
        raise HTTPException(status_code=422, detail="Invalid status value")
    
    with get_db() as conn:
        # Check if submission exists
        existing = conn.execute(
            "SELECT id FROM contact_submissions WHERE id = ?",
            (submission_id,)
        ).fetchone()
        
        if existing is None:
            raise HTTPException(status_code=404, detail="Contact submission not found")
        
        conn.execute(
            "UPDATE contact_submissions SET status = ? WHERE id = ?",
            (new_status, submission_id),
        )
        
        # Fetch updated submission
        row = conn.execute(
            "SELECT * FROM contact_submissions WHERE id = ?",
            (submission_id,)
        ).fetchone()
    
    return ContactFormResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        subject=row["subject"],
        message=row["message"],
        status=row["status"],
        created_at=row["created_at"],
    )


@router.get("/contact/health", status_code=200)
def contact_health():
    """Health check for contact form endpoint."""
    return {"status": "ok", "service": "contact-form"}
