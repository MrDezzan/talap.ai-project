package models

import (
	"time"
	"github.com/lib/pq"
	"gorm.io/datatypes"
)

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `json:"name"`
	Email        string    `gorm:"unique;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Grade        string    `json:"grade"`
	City         string    `json:"city"`
	School       string    `json:"school"`
	CreatedAt    time.Time `json:"created_at"`
}

type Grant struct {
	ID              uint     `gorm:"primaryKey" json:"id"`
	Name            string   `json:"name"`
	Subtitle        string   `json:"subtitle"`
	MatchPercentage int      `json:"match_percentage"`
	DeadlineDays    int      `json:"deadline_days"`
	Tone            string   `json:"tone"`
	Country         string   `json:"country"`
	Amount          string   `json:"amount"`
	Description     string   `json:"description"`
	Tags            pq.StringArray `gorm:"type:text[]" json:"tags"`
}

type Profession struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	Name            string         `json:"name"`
	Description     string         `json:"description"`
	Category        string         `json:"category"`
	Tags            pq.StringArray `gorm:"type:text[]" json:"tags"`
	Salary          string         `json:"salary"`
	Growth          string         `json:"growth"`
	MatchPercentage int            `json:"match_percentage"`
	Hot             bool           `json:"hot"`
}

type Portfolio struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	UserID       uint           `json:"user_id"`
	Bio          string         `json:"bio"`
	ENT          string         `json:"ent"`
	English      string         `json:"english"`
	Skills       pq.StringArray `gorm:"type:text[]" json:"skills"`
	Interests    pq.StringArray `gorm:"type:text[]" json:"interests"`
	QuizAnswers  datatypes.JSON `gorm:"type:jsonb" json:"quiz_answers"`
	Achievements datatypes.JSON `gorm:"type:jsonb" json:"achievements"`
	AIResult     datatypes.JSON `gorm:"type:jsonb" json:"ai_result"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type ChatThread struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ChatMessage struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ThreadID  uint           `json:"thread_id"`
	Role      string         `json:"role"` // "user" or "assistant"
	Content   string         `json:"content"`
	Roadmap   datatypes.JSON `gorm:"type:jsonb" json:"roadmap"`
	CVData    datatypes.JSON `gorm:"type:jsonb" json:"cv_data"`
	CreatedAt time.Time      `json:"created_at"`
}
