FROM working-flow-python-base as base

WORKDIR /app

# Copy application code
COPY backend/ ./backend/

# Install dependencies
RUN pip install -r backend/requirements.txt 

# Expose port
EXPOSE 8001

# Set environment variables
ENV PORT=8001
ENV LOG_LEVEL=INFO
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8001"] 