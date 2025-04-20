FROM working-flow-python-base

WORKDIR /app/voice-backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswscale-dev \
    libavdevice-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch and other dependencies
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install PyAV and other audio processing dependencies
RUN pip install av

# Copy voice backend code
COPY voice/backend-voice/ .

# Install voice backend dependencies
RUN pip install -r requirements.txt

# Create models directory
RUN mkdir -p /app/voice-backend/models

# Set environment variables for model paths
ENV HUGGINGFACE_HUB_CACHE=/app/voice-backend/models
ENV TRANSFORMERS_CACHE=/app/voice-backend/models
ENV TORCH_HOME=/app/voice-backend/models

# Expose port
EXPOSE 8003

# Set environment variables
ENV PORT=8003
ENV LOG_LEVEL=DEBUG
ENV MODEL_DIR=/app/voice-backend/models

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8003/health || exit 1

# Command to run agent.py directly
CMD ["python", "agent.py", "dev"]