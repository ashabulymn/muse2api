FROM python:3.11-slim-bookworm

# Lingkungan dasar & instalasi Chromium
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    MUSE2API_HOME=/app \
    MUSE2API_HOST=0.0.0.0 \
    MUSE2API_PORT=18610 \
    MUSE2API_CHROMIUM=/usr/bin/chromium \
    MUSE2API_CDP_PORT=19210

ARG BUILD_SHA=
ENV MUSE2API_BUILD_SHA=$BUILD_SHA
LABEL org.opencontainers.image.revision=$BUILD_SHA

WORKDIR /app

# Instal Chromium, font Mandarin & dependensi inti
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ffmpeg \
    fonts-wqy-zenhei \
    fonts-freefont-ttf \
    procps \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instal dependensi Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin kode & direktori yang diperlukan
COPY admin.html app.py cdp.py config.py engine.py store.py proxy.py generation_timing.py thumbnails.py version.json ./
COPY deploy/ ./deploy/
COPY extension/ ./extension/
COPY tools/ ./tools/

# Buat direktori data persisten
RUN mkdir -p /app/data/media /app/data/downloads /root/muse2api-profiles

VOLUME ["/app/data"]

EXPOSE 18610

CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "18610"]
