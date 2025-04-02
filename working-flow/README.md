# Paws Heal - Containerized Application

This repository contains a Docker-based setup for running the Paws Heal application, which consists of several services:

## Services

1. **FastAPI App (port 8000)** - Main application with RAG chatbot and admin panel
2. **Backend Services (port 8001)** - PDF processing, YouTube transcript extraction, and web scraping
3. **Data Management (port 3000)** - NodeJS service for PDF upload and YouTube link management
4. **Voice Service (port 8002)** - Voice assistant using LiveKit
5. **Redis** - Cache and session management
6. **MongoDB Atlas** - Cloud database service (external)

## Getting Started

1. Clone the repository
2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. Build and start the services:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - FastAPI App: http://localhost:8000
   - Data Management: http://localhost:3000
   - Backend API: http://localhost:8001
   - Voice Service: http://localhost:8002

## Development

- Each service has its own context in the Dockerfile, so you can build and run them independently
- Use `docker-compose logs [service_name]` to check the logs
- Use `docker-compose exec [service_name] bash` to get a shell inside a container

## Structure

- `app/` - Main FastAPI application
- `Siva/` - RAG implementation for the main app
- `backend/` - Backend services for data processing
- `datamgmt-backend/` - Node.js service for data management
- `voice/backend-voice/` - Voice assistant service
- `nltk_data/` - Natural language processing data

## Configuration

All configuration is done through environment variables. See `.env.example` for details.

## Architecture

The application is structured as a microservices architecture, with services communicating via HTTP APIs and a shared MongoDB database.

- The FastAPI app serves as the main entry point and orchestrates the RAG chatbot
- Backend services handle data ingestion (PDF, YouTube, web)
- Data Management service provides an admin interface for content management
- Voice service provides voice interaction capabilities
- MongoDB serves as the central data store and vector database

## Healthchecks

Each service includes a healthcheck to ensure it's running properly.

## Volumes

Persistent data is stored in Docker volumes:
- `mongodb_data`: Database files
- `pdf_uploads`: Uploaded PDF files
- `app_logs`, `voice_logs`: Application logs
- `backend_output`: Output files from backend processing

## Networks

All services communicate over a shared Docker network named `backend`.