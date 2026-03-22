from datetime import date as date_type
from fastapi import APIRouter, HTTPException, Query, Request

from database import get_db
from limiter import limiter
from models import SlotsResponse

router = APIRouter()


@router.get("/slots", response_model=SlotsResponse)
@limiter.limit("30/minute")
def get_slots(
    request: Request,
    date: date_type = Query(..., description="Date in YYYY-MM-DD format"),
) -> SlotsResponse:
    """Return available time slots for a given date."""
    if date < date_type.today():
        raise HTTPException(status_code=422, detail="date must not be in the past")

    with get_db() as conn:
        active_slots = conn.execute(
            "SELECT time_slot, max_bookings FROM slots_config WHERE is_active = 1"
        ).fetchall()

        available = []
        for slot in active_slots:
            count = conn.execute(
                "SELECT COUNT(*) FROM bookings "
                "WHERE date = ? AND time_slot = ? AND status = 'confirmed'",
                (date.isoformat(), slot["time_slot"]),
            ).fetchone()[0]
            if count < slot["max_bookings"]:
                available.append(slot["time_slot"])

    return SlotsResponse(
        date_available=len(available) > 0,
        slots=sorted(available),
    )
