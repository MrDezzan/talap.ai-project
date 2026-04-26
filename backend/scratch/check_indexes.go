package main

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

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

	rows, err := db.Raw("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users'").Rows()
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Indexes on 'users':")
	for rows.Next() {
		var name, def string
		rows.Scan(&name, &def)
		fmt.Printf("- %s: %s\n", name, def)
	}
}
