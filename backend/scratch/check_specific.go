package main

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID           uint
	Name         string
	Email        string
	PasswordHash string
}

func main() {
	godotenv.Load("../.env")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, pass, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}

	testEmail := "serikbol@gmail.com"
	var existing User
	err = db.Table("users").Where("email = ?", testEmail).First(&existing).Error
	if err == nil {
		fmt.Printf("User found: ID=%d, Email=%s\n", existing.ID, existing.Email)
	} else {
		fmt.Printf("User NOT found: %v\n", err)
	}
}
