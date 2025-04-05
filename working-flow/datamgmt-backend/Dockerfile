FROM node:18-alpine

WORKDIR /app/datamgmt-backend

# Copy package files
COPY datamgmt-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY datamgmt-backend/ .

# Expose port
EXPOSE 8004

# Start the application
CMD ["node", "index.js"] 