# PawsHeal

## Docker Setup Instructions

### Starting the Services
To start all services, run:
```bash
docker-compose up 
```
This command will build and start all the containers defined in the docker-compose file.

### Stopping the Services
To stop and remove all running containers, run:
```bash
docker-compose down
```
### After making changes in  the Services
To re-build it and update all running containers, run:
```bash
docker-compose up --build
```

## Service URLs

Once the services are running, you can access them at the following URLs:

### Application works on these URLs
- Main Web Interface: http://localhost:3001
- Voice service at : http://localhost:3000

### FastAPI Services
- Main API: http://localhost:8000
  - API Documentation: http://localhost:8000/docs
  - Backend route APIs : http://localhost:8001/docs
  - Chat APIs : http://localhost:8002/docs
  - OpenAPI Specification: http://localhost:8000/redoc

### Frontend Services
- Main Web Interface: http://localhost:3001
- Voice service at : http://localhost:3000

## Additional Information
- Make sure you have Docker and Docker Compose installed on your system
- All services will be built and started in the correct order
- The system uses environment variables defined in the .env file
- Check the logs in the Docker Compose output for any potential issues

## Troubleshooting
If you encounter any issues:
1. Make sure all ports are available and not used by other services
2. Check Docker logs for specific error messages
3. Ensure all required environment variables are properly set
