FROM python:3.15-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ripgrep bash git && \
    rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/bash ohuser
USER ohuser
