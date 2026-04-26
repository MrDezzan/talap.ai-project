# Talkd Backend (Go)

## Setup
1. Install Go 1.21+
2. Run `go mod download`
3. Start the server: `go run main.go`

## Docker
Or use Docker:
```bash
docker build -t talkd-backend .
docker run -p 8080:8080 talkd-backend
```

## Database
The database is hosted at `a1-postgres1.alem.ai:30100`.
Schema is defined in `schema.sql`.
Use `setup_db.py` to wipe and re-initialize the database if needed.
