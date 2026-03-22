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
    import os
    from zoneinfo import ZoneInfo
    from datetime import datetime as dt
    tz = ZoneInfo(os.environ.get("RESTAURANT_TZ", "Europe/Rome"))
    today_local = dt.now(tz).date()
    if date < today_local:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="date must not be in the past")

    with get_db() as conn:
        active_slots = conn.execute(
            "SELECT time_slot, max_bookings FROM slots_config WHERE is_active = 1"
        ).fetchall()

        # Single aggregation query instead of N+1
        rows = conn.execute(
            "SELECT time_slot, COUNT(*) AS cnt FROM bookings "
            "WHERE date = ? AND status = 'confirmed' GROUP BY time_slot",
            (date.isoformat(),),
        ).fetchall()
        counts = {row["time_slot"]: row["cnt"] for row in rows}

        available = [
            s["time_slot"] for s in active_slots
            if counts.get(s["time_slot"], 0) < s["max_bookings"]
        ]

    return SlotsResponse(
        date_available=len(available) > 0,
        slots=sorted(available),
    )
