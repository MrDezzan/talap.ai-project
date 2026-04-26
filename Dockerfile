# --- STAGE 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# For unified deployment, API URL is usually same domain or handled by Go
ENV VITE_API_URL=/api
RUN npm run build

# --- STAGE 2: Build Backend ---
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN cd . && go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# --- STAGE 3: Final Image ---
FROM alpine:latest
WORKDIR /root/
# Copy binary
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/schema.sql .
# Copy frontend assets to where Go expects them
COPY --from=frontend-builder /app/dist ./dist

# Set production env
ENV GIN_MODE=release
EXPOSE 8080
CMD ["./main"]
