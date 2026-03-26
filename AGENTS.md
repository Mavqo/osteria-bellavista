# Osteria Bellavista - Project Documentation

## Project Overview
Restaurant website with booking system, menu gallery, and contact form.

**Tech Stack:**
- Frontend: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLite + Pydantic + SlowAPI (rate limiting)
- Testing: pytest (backend)

## Architecture

### Directory Structure
```
osteria-bellavista/
├── frontend/           # Next.js application
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   │   ├── sections/  # Page sections (Hero, Menu, Contact, etc.)
│   │   ├── ui/        # UI primitives (Button, Card, etc.)
│   │   └── seo/       # SEO components
│   └── lib/           # Utilities and data
├── backend/           # FastAPI application
│   ├── routes/        # API routes (bookings, contact, slots)
│   ├── models.py      # Pydantic models
│   ├── database.py    # SQLite database
│   └── tests/         # pytest test suite
└── docs/              # Documentation
```

### Data Flow
```
User → Frontend (Next.js) → FastAPI → SQLite
                    ↓
              Email Service (SMTP)
```

## Features

### 1. Booking System
- **Frontend:** Multi-step booking form with date picker, time slots, guest selection
- **Backend:** `/bookings` endpoint with capacity management, rate limiting (5/min)
- **Database:** `bookings` table with status tracking

### 2. Contact Form
- **Frontend:** Contact section with form validation, loading states, success feedback
- **Backend:** `/contact` endpoint with rate limiting (3/min)
- **Database:** `contact_submissions` table
- **Validation:**
  - Name: required, max 100 chars
  - Email: required, valid format, max 254 chars
  - Subject: required, max 200 chars
  - Message: required, max 2000 chars

### 3. Menu Gallery
- Dynamic menu display with categories (antipasti, primi, secondi, dolci)
- Sample data seeded in database

## API Endpoints

### Bookings
```
POST /bookings
{
  "name": "string (required, max 100)",
  "phone": "string (optional)",
  "date": "YYYY-MM-DD",
  "time_slot": "HH:MM",
  "party_size": "integer (1-10)"
}
```

### Contact
```
POST /contact
{
  "name": "string (required, max 100)",
  "email": "string (required, valid email)",
  "subject": "string (required, max 200)",
  "message": "string (required, max 2000)"
}
```

### Slots
```
GET /slots?date=YYYY-MM-DD
Response: {
  "date_available": boolean,
  "slots": ["HH:MM", ...]
}
```

## Environment Variables

### Backend
```bash
DATABASE_PATH=/data/osteria.db
CORS_ORIGIN=http://localhost:3000
RESTAURANT_TZ=Europe/Rome
RESTAURANT_EMAIL=restaurant@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

## Development Notes

### Backend Development
```bash
cd backend
source .venv/bin/activate  # or venv/bin/activate for Python 3.9
uvicorn main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Testing
```bash
cd backend
pytest -v
```

## Quality Gates

1. **TDD Required:** 80%+ test coverage for all new code
2. **Security Review:** Input validation on all endpoints
3. **Rate Limiting:** All mutation endpoints have rate limits
4. **Validation:** Pydantic models for all request/response data

## Database Schema

### bookings
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at DATETIME DEFAULT (datetime('now'))
);
```

### contact_submissions
```sql
CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME DEFAULT (datetime('now'))
);
```

### slots_config
```sql
CREATE TABLE slots_config (
    time_slot TEXT PRIMARY KEY,
    max_bookings INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1
);
```

### menu_items
```sql
CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now'))
);
```

## Deployment

### Docker
```bash
docker build -t osteria-bellavista .
docker run -p 8000:8000 -v /data:/data osteria-bellavista
```

## Contact

For questions about this project, contact the development team.
