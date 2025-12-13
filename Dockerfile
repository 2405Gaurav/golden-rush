# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Railway automatically injects environment variables during build
# NEXT_PUBLIC_* vars must be available at build time for Next.js
# Set default if not provided (Railway will override with actual value)
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://sweetshop-backend-production.up.railway.app}

# Build the application
# Railway makes all env vars available during RUN commands
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production || npm install --production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000

# Start the application
CMD ["npm", "start"]


