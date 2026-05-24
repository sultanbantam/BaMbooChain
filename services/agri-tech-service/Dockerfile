# Stage 1: Build dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./

# Create data directory for file persistence
RUN mkdir -p data

EXPOSE 5001
ENV PORT=5001
ENV NODE_ENV=production

CMD ["node", "server.js"]
