package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"talkd-backend/config"
	"talkd-backend/handlers"
	"talkd-backend/middleware"
	"talkd-backend/models"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	db := config.InitDB()

	if err := db.AutoMigrate(&models.User{}, &models.Grant{}, &models.Profession{}, &models.Portfolio{}, &models.ChatThread{}, &models.ChatMessage{}); err != nil {
		log.Printf("AutoMigrate error: %v", err)
	}
	config.SeedDB(db)

	r := gin.Default()

	allowedOrigin := os.Getenv("CORS_ALLOWED_ORIGINS")
	corsConfig := cors.Config{
		AllowMethods:  []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
		MaxAge:        12 * time.Hour,
	}

	if allowedOrigin == "" || allowedOrigin == "*" {
		corsConfig.AllowAllOrigins = true
	} else {
		corsConfig.AllowOrigins = strings.Split(allowedOrigin, ",")
	}

	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	{
		api.POST("/register", handlers.Register(db))
		api.POST("/login", handlers.Login(db))
		api.GET("/auth/google/login", handlers.GoogleLogin)
		api.GET("/auth/google/callback", handlers.GoogleCallback(db))

		api.GET("/grants", handlers.GetGrants(db))
		api.GET("/professions", handlers.GetProfessions(db))
		api.GET("/search", handlers.GlobalSearch(db))

		auth := api.Group("/")
		auth.Use(middleware.AuthRequired())
		{
			auth.GET("/me", handlers.GetMe(db))
			auth.PUT("/me", handlers.UpdateMe(db))
			auth.GET("/dashboard", handlers.GetDashboardData(db))
			auth.GET("/portfolio", handlers.GetPortfolio(db))
			auth.PUT("/portfolio", handlers.UpdatePortfolio(db))
			auth.POST("/ai/analyze", handlers.AnalyzeProfile(db))
			auth.POST("/ai/chat", handlers.AIChat(db))
			auth.GET("/chats", handlers.GetChatThreads(db))
			auth.GET("/chats/:id/messages", handlers.GetChatMessages(db))
		}
	}

	// Serve Static Files for Production
	r.Static("/assets", "./dist/assets")
	r.StaticFile("/logo.svg", "./dist/logo.svg")
	r.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/api") {
			c.File("./dist/index.html")
		}
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
