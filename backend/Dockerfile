FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code and trained models
COPY backend/ /app/backend/
COPY models/ /app/models/

EXPOSE 8000

ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/biosentra

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
