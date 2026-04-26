package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"talkd-backend/auth"
	"talkd-backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

var googleOauthConfig *oauth2.Config

func init() {
	// These will be initialized in main or here via env
}

func getGoogleConfig() *oauth2.Config {
	if googleOauthConfig == nil {
		googleOauthConfig = &oauth2.Config{
			RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
			ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
			Endpoint:     google.Endpoint,
		}
	}
	return googleOauthConfig
}

func GoogleLogin(c *gin.Context) {
	config := getGoogleConfig()
	url := config.AuthCodeURL("state-token") // In production, use a secure random state
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")
		config := getGoogleConfig()

		token, err := config.Exchange(context.Background(), code)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to exchange token"})
			return
		}

		resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get user info"})
			return
		}
		defer resp.Body.Close()

		var googleUser struct {
			ID    string `json:"id"`
			Email string `json:"email"`
			Name  string `json:"name"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode user info"})
			return
		}

		// Find or create user
		var user models.User
		if err := db.Where("email = ?", googleUser.Email).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				user = models.User{
					Email: googleUser.Email,
					Name:  googleUser.Name,
				}
				db.Create(&user)
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}
		}

		// Generate JWT
		jwtToken, err := auth.GenerateToken(user.ID, user.Email, user.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		// Redirect back to frontend with token
		frontendURL := os.Getenv("FRONTEND_URL")
		if frontendURL == "" {
			frontendURL = "https://talapai-project-production.up.railway.app"
		}
		
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%s/login?token=%s", frontendURL, jwtToken))
	}
}
