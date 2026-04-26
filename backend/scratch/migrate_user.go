package main

import (
	"log"
	"os"
	"fmt"
	"time"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID           uint      `gorm:"primaryKey"`
	Name         string
	Email        string    `gorm:"unique;not null"`
	PasswordHash string    `gorm:"not null"`
	Grade        string
	City         string
	School       string
	CreatedAt    time.Time
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

	fmt.Println("Running AutoMigrate for User...")
	err = db.AutoMigrate(&User{})
	if err != nil {
		fmt.Printf("AutoMigrate FAILED: %v\n", err)
	} else {
		fmt.Println("AutoMigrate SUCCESSFUL")
	}
}
