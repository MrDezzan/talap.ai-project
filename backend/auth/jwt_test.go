package auth

import (
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestTokenGenerationAndVerification(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret_key")

	userID := uint(1)
	email := "test@example.com"
	name := "Test User"

	tokenStr, err := GenerateToken(userID, email, name)
	if err != nil {
		t.Fatalf("Expected no error while generating token, got: %v", err)
	}
	if tokenStr == "" {
		t.Fatal("Expected a non-empty token string")
	}

	claims, err := VerifyToken(tokenStr)
	if err != nil {
		t.Fatalf("Expected no error while verifying token, got: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("Expected UserID %d, got %d", userID, claims.UserID)
	}
	if claims.Email != email {
		t.Errorf("Expected Email %s, got %s", email, claims.Email)
	}
	if claims.Name != name {
		t.Errorf("Expected Name %s, got %s", name, claims.Name)
	}
}

func TestVerifyToken_InvalidSignature(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret_key")

	tokenStr, _ := GenerateToken(1, "test@example.com", "User")
	
	// Change secret to simulate invalid signature
	os.Setenv("JWT_SECRET", "wrong_secret")
	
	_, err := VerifyToken(tokenStr)
	if err == nil {
		t.Fatal("Expected an error for invalid token signature, got nil")
	}
}

func TestVerifyToken_Expired(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret_key")

	// Generate an expired token
	claims := Claims{
		UserID: 1,
		Email:  "test@test.com",
		Name:   "Test",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-1 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now().Add(-2 * time.Hour)),
		},
	}
	tokenStr, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("test_secret_key"))

	_, err := VerifyToken(tokenStr)
	if err == nil {
		t.Fatal("Expected an error for expired token, got nil")
	}
}
