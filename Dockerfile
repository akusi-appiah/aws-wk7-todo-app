# Stage 1: Build Angular Frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build -- --configuration production

# Stage 2: Build Node.js Backend
FROM node:20 AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production
COPY backend/ ./

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies and source
COPY --from=backend-builder /app/backend /app

# Copy built Angular files
COPY --from=frontend-builder /app/frontend/dist/frontend/browser /app/public

# Install production dependencies
RUN npm cache clean --force

# Environment variables
ENV PORT=3000
ENV NODE_ENV=production
ENV TODO_TABLE_NAME=TodoAppTable
ENV AWS_REGION=eu-west-1

# Expose port and set user
EXPOSE 3000
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "server.js"]