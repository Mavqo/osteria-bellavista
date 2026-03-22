from fastapi import APIRouter, HTTPException, Request

from database import get_db
from email_service import send_notification
from limiter import limiter
from models import BookingCreate, BookingResponse

router = APIRouter()


@router.post("/bookings", response_model=BookingResponse, status_code=201)
@limiter.limit("5/minute")
def create_booking(request: Request, booking: BookingCreate) -> BookingResponse:
    """Create a booking if the requested slot is available."""
    with get_db() as conn:
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

        # Insert booking
        cursor = conn.execute(
            "INSERT INTO bookings (name, phone, date, time_slot, party_size, status) "
            "VALUES (?, ?, ?, ?, ?, 'confirmed')",
            (booking.name, booking.phone, booking.date.isoformat(), booking.time_slot, booking.party_size),
        )
        booking_id = cursor.lastrowid

    booking_dict = {
        "id": booking_id,
        "name": booking.name,
        "phone": booking.phone,
        "date": booking.date.isoformat(),
        "time_slot": booking.time_slot,
        "party_size": booking.party_size,
        "status": "confirmed",
    }

    # Non-blocking notification — failure does not affect response
    send_notification(booking_dict)

    return BookingResponse(**booking_dict)
