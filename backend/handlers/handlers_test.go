package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"talkd-backend/models"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&models.User{}, &models.Portfolio{})
	return db
}

func TestRegisterAndLogin(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret_key")
	db := setupTestDB()
	gin.SetMode(gin.TestMode)

	// Test Registration
	r := gin.Default()
	r.POST("/register", Register(db))

	registerPayload := map[string]string{
		"name":     "Test User",
		"email":    "test@example.com",
		"password": "password123",
	}
	body, _ := json.Marshal(registerPayload)
	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200 OK for registration, got %v", w.Code)
	}

	// Test Login
	r.POST("/login", Login(db))

	loginPayload := map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	}
	body, _ = json.Marshal(loginPayload)
	req, _ = http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200 OK for login, got %v. Body: %s", w.Code, w.Body.String())
	}

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	if _, ok := response["token"]; !ok {
		t.Fatal("Expected token in login response")
	}
}

func TestRegister_InvalidEmail(t *testing.T) {
	db := setupTestDB()
	gin.SetMode(gin.TestMode)

	r := gin.Default()
	r.POST("/register", Register(db))

	payload := map[string]string{
		"name":     "Test",
		"email":    "invalid-email",
		"password": "password123",
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("Expected status 400 for invalid email, got %v", w.Code)
	}
}
