FROM node:20-alpine

WORKDIR /app/voice-frontend

# Copy package files and install dependencies
COPY voice/frontend/package.json voice/frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend code
COPY voice/frontend/ .

# Build the Next.js application
RUN yarn build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the application
CMD ["yarn", "start"] 