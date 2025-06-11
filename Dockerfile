FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY svelte.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY static/ ./static/

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --production

# Add security headers
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "build"] 