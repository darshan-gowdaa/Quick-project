FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source
COPY backend ./backend

WORKDIR /app/backend

# Railway routes to 8080 by default
ENV PORT=8080

CMD ["npm", "start"]

