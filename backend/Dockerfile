FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source
COPY . .

EXPOSE 8000

ENV DATABASE_PATH=/data/osteria.db

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
