# CACHE BUSTER: $(date +%s)
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
# Verifica che il build sia stato creato
RUN ls -la /app/frontend/dist/ && echo "BUILD SUCCESS"

# Stage 2: Build Backend
FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

# Verifica finale
RUN ls -la ./frontend/dist/ 2>&1 || echo "WARNING: frontend/dist not found!"

EXPOSE 8000
ENV DATABASE_PATH=/data/osteria.db

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
