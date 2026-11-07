# ==============================================================================
# ISURU SERVICE CENTER POS: BACKEND DOCKERFILE
# Multi-stage production build for Node.js + Express + Prisma ORM
# ==============================================================================

# Stage 1: Build & compile TypeScript
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Stage 2: Minimal production runtime image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5050

# Install runtime utilities
RUN apk add --no-cache wget

# Copy production artifacts and dependencies
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create upload directory and assign non-root permissions
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5050

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:5050/api/v1/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
