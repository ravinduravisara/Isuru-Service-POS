# ==============================================================================
# ISURU SERVICE CENTER POS: FRONTEND DOCKERFILE
# Multi-stage build for React (Vite) + Nginx SPA Server
# ==============================================================================

# Stage 1: Build React Assets
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Minimal Nginx Runtime
FROM nginx:alpine AS runner

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built static files to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
