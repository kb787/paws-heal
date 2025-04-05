FROM working-flow-python-base as base

WORKDIR /app

# Copy application code
COPY app/ ./app/
COPY backend/ ./backend/
COPY Siva/ ./Siva/

# Install dependencies
RUN pip install -r app/requirements.txt
RUN pip install -r backend/requirements.txt
RUN pip install -r Siva/requirements.txt

# Expose port
EXPOSE 8000

# Set environment variables
ENV PORT=8000
ENV LOG_LEVEL=INFO
ENV PYTHONPATH=/app:/app/backend:/app/Siva

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 