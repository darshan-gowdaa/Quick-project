FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source
COPY backend ./backend
COPY frontend ./frontend

# Build frontend for production
RUN cd frontend && npm run build

# Runtime config
WORKDIR /app/backend
ENV PORT=8080
ENV NODE_ENV=production

# Start backend directly
CMD ["node", "server.js"]

