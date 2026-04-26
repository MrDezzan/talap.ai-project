# --- STAGE 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=/api
RUN npm run build

# --- STAGE 2: Build Backend ---
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# --- STAGE 3: Final Image ---
FROM alpine:latest
WORKDIR /root/
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/schema.sql .
COPY --from=frontend-builder /app/dist ./dist

ENV GIN_MODE=release
EXPOSE 8080
CMD ["./main"]
