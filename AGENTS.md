# Osteria Bellavista - System Architecture

> Restaurant website with booking system, menu gallery, and contact form.
> Stack: React + Next.js (frontend) + FastAPI (backend)

---

## 1. Project Context

### Overview
Osteria Bellavista is a traditional Ticinese restaurant in Lugano, Switzerland, established in 1987. The website showcases:
- Restaurant information and history
- Menu gallery with categorized dishes
- Table booking system with time slot management
- Contact form for inquiries
- Multi-language support (IT, DE, EN)

### Domain
- **Primary market**: Lugano, Switzerland (Ticino region)
- **Timezone**: Europe/Rome (CET/CEST)
- **Languages**: Italian (primary), German, English
- **Currency**: CHF (display only, no payments)

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js 16 (App Router)                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │    Hero     │  │    Menu     │  │   Booking   │  │   Contact   │ │  │
│  │  │   Section   │  │   Gallery   │  │   System    │  │    Form     │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │                                                                      │  │
│  │  Tech: React 19, TypeScript, Tailwind CSS v4, Framer Motion         │  │
│  │  Features: SSR, i18n, Custom cursor, Scroll animations              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ HTTP/REST + CORS
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         FastAPI (Python)                              │  │
│  │                                                                       │  │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │  │
│  │   │  /health    │    │   /slots    │    │  /bookings  │              │  │
│  │   │   (GET)     │    │   (GET)     │    │   (POST)    │              │  │
│  │   └─────────────┘    └─────────────┘    └─────────────┘              │  │
│  │                                                                       │  │
│  │   Middleware: CORS, Rate Limiting (SlowAPI)                          │  │
│  │   Validation: Pydantic Models                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ SQLite
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         SQLite Database                               │  │
│  │                                                                       │  │
│  │   ┌─────────────────┐    ┌─────────────────┐                         │  │
│  │   │    bookings     │    │  slots_config   │                         │  │
│  │   │  - id (PK)      │    │  - time_slot    │                         │  │
│  │   │  - name         │    │  - max_bookings │                         │  │
│  │   │  - phone        │    │  - is_active    │                         │  │
│  │   │  - date         │    └─────────────────┘                         │  │
│  │   │  - time_slot    │                                              │  │
│  │   │  - party_size   │                                              │  │
│  │   │  - status       │                                              │  │
│  │   │  - created_at   │                                              │  │
│  │   └─────────────────┘                                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ SMTP
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NOTIFICATION LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Email Service (SMTP)                             │  │
│  │                                                                       │  │
│  │   - Booking confirmations (background task)                          │  │
│  │   - Contact form submissions                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page composition
│   ├── robots.ts                # SEO robots config
│   └── sitemap.ts               # SEO sitemap config
│
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── sections/                # Page sections
│   │   ├── hero.tsx
│   │   ├── menu-section.tsx
│   │   ├── experiences-section.tsx
│   │   ├── gallery-section.tsx
│   │   ├── booking-section.tsx
│   │   └── footer.tsx
│   ├── navbar.tsx
│   ├── cursor.tsx               # Custom cursor effect
│   ├── cookie-banner.tsx
│   └── seo/                     # SEO components
│
└── lib/
    ├── i18n.tsx                 # Internationalization
    ├── utils.ts                 # Utilities (cn helper)
    └── data.ts                  # Static data (menu items, etc.)

backend/
├── main.py                      # FastAPI app factory
├── models.py                    # Pydantic schemas
├── database.py                  # SQLite connection management
├── limiter.py                   # Rate limiting config
├── email_service.py             # SMTP email sender
└── routes/
    ├── bookings.py              # Booking endpoints
    └── slots.py                 # Availability endpoints
```

---

## 3. Tech Stack

### 3.1 Frontend

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| Framework | Next.js | 16.2.1 | App Router, SSR, SSG, optimized images |
| Runtime | React | 19.2.4 | Concurrent features, improved hydration |
| Language | TypeScript | 5.x | Type safety, better DX |
| Styling | Tailwind CSS | 4.x | Utility-first, design system alignment |
| UI Components | shadcn/ui | latest | Accessible, customizable primitives |
| Animation | Framer Motion | 12.x | Declarative animations, gestures |
| Icons | Lucide React | latest | Consistent icon set |
| i18n | next-intl | 4.x | App Router native integration |
| Date Handling | date-fns | 4.x | Modular date utilities |
| Calendar | react-day-picker | 9.x | Accessible date picker |

### 3.2 Backend

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| Framework | FastAPI | latest | Async, auto-docs, Pydantic validation |
| Runtime | Python | 3.12 | Modern features, type hints |
| Database | SQLite | built-in | Serverless, sufficient for booking data |
| ORM/Models | Pydantic | 2.x | Data validation, serialization |
| Rate Limiting | SlowAPI | latest | Redis-compatible limiting |
| CORS | fastapi-cors | built-in | Cross-origin requests |
| Email | smtplib | stdlib | SMTP for notifications |

### 3.3 Infrastructure

| Category | Technology | Purpose |
|----------|------------|---------|
| Container | Docker | Development consistency |
| Platform | Railway/Vercel | Deployment (inferred from railway.toml) |
| Database | SQLite file | Simple persistence |
| Email | External SMTP | Booking notifications |

---

## 4. API Specifications

### 4.1 Base URL
```
Development: http://localhost:8000
Production:  https://api.osteriabellavista.ch (inferred)
```

### 4.2 Authentication
- **Public Endpoints**: No authentication required
- **Rate Limiting**: Per-IP limiting via SlowAPI

### 4.3 Endpoints

#### Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

#### Get Available Slots

```http
GET /slots?date=YYYY-MM-DD
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| date | string (date) | Yes | Date in YYYY-MM-DD format |

**Rate Limit:** 30 requests/minute

**Response (200 OK):**
```json
{
  "date_available": true,
  "slots": ["12:00", "13:00", "20:00", "21:00"]
}
```

**Error Responses:**
- `400 Bad Request` - Missing date parameter
- `422 Unprocessable Entity` - Date in the past or invalid format
- `429 Too Many Requests` - Rate limit exceeded

---

#### Create Booking

```http
POST /bookings
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mario Rossi",
  "phone": "+41 79 123 4567",
  "date": "2025-04-15",
  "time_slot": "20:00",
  "party_size": 4
}
```

**Field Validation:**
| Field | Type | Constraints |
|-------|------|-------------|
| name | string | 1-100 chars, required, trimmed |
| phone | string | 7-15 digits, +/space/dash allowed, optional |
| date | string (date) | ISO 8601, not in past |
| time_slot | string | HH:MM format |
| party_size | integer | 1-10 inclusive |

**Rate Limit:** 5 requests/minute

**Response (201 Created):**
```json
{
  "id": 42,
  "name": "Mario Rossi",
  "date": "2025-04-15",
  "time_slot": "20:00",
  "party_size": 4,
  "status": "confirmed"
}
```

**Error Responses:**
- `400 Bad Request` - Malformed JSON
- `422 Unprocessable Entity` - Validation failure (field-level details)
- `409 Conflict` - Slot fully booked
- `429 Too Many Requests` - Rate limit exceeded

**Error Response Format:**
```json
{
  "detail": "validation error message"
}
```

---

### 4.4 Time Slot Configuration

Static configuration seeded on database initialization:

| Time Slot | Max Bookings | Active |
|-----------|--------------|--------|
| 12:00 | 4 | Yes |
| 13:00 | 4 | Yes |
| 20:00 | 4 | Yes |
| 21:00 | 4 | Yes |
| 21:30 | 4 | Yes |

---

### 4.5 CORS Configuration

```python
allow_origins=[CORS_ORIGIN]      # Configured via env var
allow_methods=["GET", "POST"]
allow_headers=["Content-Type"]
```

---

## 5. Data Models

### 5.1 Database Schema

```sql
-- Bookings table
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

-- Slot configuration
CREATE TABLE slots_config (
    time_slot TEXT PRIMARY KEY,
    max_bookings INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1
);
```

### 5.2 Pydantic Models

```python
# Input: Create booking
class BookingCreate(BaseModel):
    name: str                    # validated: 1-100 chars
    phone: str | None = None     # validated: 7-15 digits
    date: date                   # validated: not in past
    time_slot: str               # validated: HH:MM format
    party_size: int              # validated: 1-10

# Output: Slots availability
class SlotsResponse(BaseModel):
    date_available: bool
    slots: list[str]

# Output: Confirmed booking
class BookingResponse(BaseModel):
    id: int
    name: str
    date: str
    time_slot: str
    party_size: int
    status: str
```

---

## 6. Environment Configuration

### 6.1 Backend (.env)

```bash
# Required
DATABASE_PATH=osteria.db
CORS_ORIGIN=http://localhost:3000
RESTAURANT_TZ=Europe/Rome

# Optional (with defaults)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
NOTIFICATION_EMAIL=bookings@osteriabellavista.ch
```

### 6.2 Frontend Environment Variables

```bash
# API base URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 7. Coding Conventions

### 7.1 Python (Backend)

- **Style**: PEP 8, black formatting
- **Types**: Full type annotations required
- **Docstrings**: Google style
- **Async**: Use async/await for I/O operations
- **Error Handling**: HTTPException with appropriate status codes
- **Database**: Context managers for connections

```python
# Example pattern
def get_entity(entity_id: int) -> Entity:
    """Retrieve entity by ID.
    
    Args:
        entity_id: The entity identifier
        
    Returns:
        The entity object
        
    Raises:
        HTTPException: If entity not found (404)
    """
    with get_db() as conn:
        row = conn.execute("SELECT * FROM entities WHERE id = ?", (entity_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="entity not found")
        return Entity(**dict(row))
```

### 7.2 TypeScript/React (Frontend)

- **Style**: ESLint + Prettier defaults
- **Types**: Strict TypeScript, no `any`
- **Components**: PascalCase, default exports for pages
- **Hooks**: camelCase, prefixed with `use`
- **Utils**: camelCase, descriptive names
- **CSS**: Tailwind classes, `cn()` for conditional merging

```typescript
// Component pattern
interface BookingFormProps {
  onSubmit: (data: BookingData) => Promise<void>;
  initialDate?: Date;
}

export function BookingForm({ onSubmit, initialDate }: BookingFormProps) {
  // Implementation
}
```

### 7.3 File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `BookingForm.tsx` |
| Utils/Hooks | camelCase | `useBooking.ts` |
| Constants | UPPER_SNAKE | `API_ENDPOINTS.ts` |
| Styles | kebab-case | `globals.css` |
| API Routes | kebab-case | `bookings.py` |

---

## 8. Testing Strategy

### 8.1 Backend Tests (pytest)

```bash
cd backend
pytest tests/ -v
```

**Coverage areas:**
- Input validation (Pydantic models)
- API endpoints (FastAPI TestClient)
- Database operations
- Rate limiting behavior

### 8.2 Frontend Tests

- Component tests with React Testing Library
- E2E tests with Playwright (recommended)

---

## 9. Deployment

### 9.1 Docker

```bash
# Build and run
docker build -t osteria-backend .
docker run -p 8000:8000 --env-file .env osteria-backend
```

### 9.2 Frontend Build

```bash
cd frontend
npm run build  # Outputs to .next/
```

---

## 10. Security Considerations

- **Input Validation**: Pydantic models validate all inputs
- **SQL Injection**: Parameterized queries only
- **Rate Limiting**: SlowAPI protects against abuse
- **CORS**: Restricted to configured origin
- **No Secrets in Code**: Environment variables for all secrets
- **No PII Storage**: Minimal customer data (name, phone)

---

## 11. Future Enhancements

Potential features for future iterations:
- Admin dashboard for managing bookings
- Email confirmation templates
- SMS notifications
- Customer booking history
- Online menu management
- Integration with reservation platforms

---

## 12. References

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
