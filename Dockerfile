# Multi-stage build for Pascal Travels & Tours
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY www/server/package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY www/server/ ./server/
COPY www/ ../www/

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server/server.js"]
