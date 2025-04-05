FROM node:18-alpine

WORKDIR /app/frontend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the app in dev mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"] 