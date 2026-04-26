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
	ID           uint   `gorm:"primaryKey"`
	Name         string
	Email        string `gorm:"unique;not null"`
	PasswordHash string `gorm:"not null"`
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

	testUser := User{
		Name:         "Serikbol",
		Email:        "serikbol@gmail.com",
		PasswordHash: "test_hash",
	}

	err = db.Create(&testUser).Error
	if err != nil {
		fmt.Printf("FAILED to create: %v\n", err)
	} else {
		fmt.Printf("SUCCESSfully created user ID=%d\n", testUser.ID)
		// Now delete it to clean up
		db.Delete(&testUser)
		fmt.Println("Deleted test user.")
	}
}
