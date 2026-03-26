from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from database import get_db
from email_service import send_notification
from limiter import limiter
from models import BookingCreate, BookingResponse

router = APIRouter()


@router.post("/bookings", response_model=BookingResponse, status_code=201)
@limiter.limit("5/minute")
def create_booking(request: Request, booking: BookingCreate, background_tasks: BackgroundTasks) -> BookingResponse:
    """Create a booking if the requested slot is available."""
    with get_db() as conn:
        conn.execute("BEGIN IMMEDIATE")

        # Verify slot exists
        slot = conn.execute(
            "SELECT max_bookings FROM slots_config WHERE time_slot = ? AND is_active = 1",
            (booking.time_slot,),
        ).fetchone()
        if slot is None:
            raise HTTPException(status_code=422, detail="time_slot is not available")

        # Check capacity
        count = conn.execute(
            "SELECT COUNT(*) FROM bookings "
            "WHERE date = ? AND time_slot = ? AND status = 'confirmed'",
            (booking.date.isoformat(), booking.time_slot),
        ).fetchone()[0]
        if count >= slot["max_bookings"]:
            raise HTTPException(status_code=409, detail="slot is fully booked")

        # Insert booking with new fields
        cursor = conn.execute(
            "INSERT INTO bookings (name, phone, email, date, time_slot, party_size, table_preference, notes, status) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')",
            (
                booking.name,
                booking.phone,
                booking.email,
                booking.date.isoformat(),
                booking.time_slot,
                booking.party_size,
                booking.table_preference,
                booking.notes,
            ),
        )
        booking_id = cursor.lastrowid

    booking_dict = {
        "id": booking_id,
        "name": booking.name,
        "phone": booking.phone,
        "email": booking.email,
        "date": booking.date.isoformat(),
        "time_slot": booking.time_slot,
        "party_size": booking.party_size,
        "table_preference": booking.table_preference,
        "notes": booking.notes,
        "status": "confirmed",
    }

    background_tasks.add_task(send_notification, booking_dict)

    return BookingResponse(**booking_dict)


@router.get("/bookings/today", status_code=200)
@limiter.limit("10/minute")
def get_today_bookings(request: Request):
    """Get all bookings for today (for n8n automation)."""
    from datetime import datetime
    import os
    from zoneinfo import ZoneInfo
    
    tz = ZoneInfo(os.environ.get("RESTAURANT_TZ", "Europe/Rome"))
    today = datetime.now(tz).date().isoformat()
    
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, email, phone, date, time_slot, party_size, table_preference, notes, status "
            "FROM bookings WHERE date = ? AND status = 'confirmed' ORDER BY time_slot",
            (today,),
        ).fetchall()
        
        bookings = [
            {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "phone": row["phone"],
                "date": row["date"],
                "time_slot": row["time_slot"],
                "party_size": row["party_size"],
                "table_preference": row["table_preference"],
                "notes": row["notes"],
                "status": row["status"],
            }
            for row in rows
        ]
    
    return {
        "date": today,
        "count": len(bookings),
        "bookings": bookings
    }
