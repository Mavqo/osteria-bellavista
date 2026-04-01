FROM python:3.12-slim

WORKDIR /app

# Build context is repo root — reference backend/ prefix
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/

EXPOSE 8000

ENV DATABASE_PATH=/data/osteria.db

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
# Force rebuild Wed Apr  1 22:12:47 CEST 2026
