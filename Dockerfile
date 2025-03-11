# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies and Bloomberg API requirements
RUN apt-get update && apt-get install -y \
    build-essential \
    libxml2-dev \
    libxslt-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies including Bloomberg API
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir --index-url=https://blpapi.bloomberg.com/repository/releases/python/simple/ blpapi

# Copy source code
COPY . .

# Set Bloomberg environment variables
ENV BLPAPI_ROOT=/app/bloomberg
ENV PATH="${PATH}:${BLPAPI_ROOT}/bin"
ENV LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${BLPAPI_ROOT}/lib"

# Create directory for Bloomberg API logs
RUN mkdir -p /app/bloomberg/logs

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "main.py"] 