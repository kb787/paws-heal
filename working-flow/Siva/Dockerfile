FROM working-flow-python-base as base

WORKDIR /app

# Copy application code
COPY Siva/ ./Siva/
COPY app/ ./app/
COPY backend/ ./backend/

# Expose port
EXPOSE 8002

# Set environment variables
ENV PORT=8002
ENV LOG_LEVEL=INFO
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "Siva.rag.main:app", "--host", "0.0.0.0", "--port", "8002"] 