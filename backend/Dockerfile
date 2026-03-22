FROM python:3.12-slim

WORKDIR /app

# Railway build context is the repo root, so prefix paths with backend/
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

ENV DATABASE_PATH=/data/osteria.db

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
