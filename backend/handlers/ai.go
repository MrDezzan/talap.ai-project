package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
	"gorm.io/gorm"
	"sync"
	"talkd-backend/models"
)

func openaiClient() (*openai.Client, error) {
	key := os.Getenv("OPENAI_API_KEY")
	url := os.Getenv("LLM_BASE_URL")
	if key == "" {
		return nil, fmt.Errorf("AI_API_KEY not set")
	}
	config := openai.DefaultConfig(key)
	if url != "" {
		config.BaseURL = url
	}
	return openai.NewClientWithConfig(config), nil
}

func llmModel() string {
	m := os.Getenv("LLM_MODEL")
	if m == "" {
		return "anthropic/claude-sonnet-4.6"
	}
	return m
}

func AnalyzeProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		uid, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user context"})
			return
		}

		var input struct {
			Interests   []string `json:"interests"`
			QuizAnswers any      `json:"quiz_answers"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
		}

		var portfolio models.Portfolio
		db.FirstOrCreate(&portfolio, models.Portfolio{UserID: uid})

		if len(input.Interests) > 0 {
			portfolio.Interests = input.Interests
		}
		if input.QuizAnswers != nil {
			qaJSON, _ := json.Marshal(input.QuizAnswers)
			portfolio.QuizAnswers = qaJSON
		}

		client, err := openaiClient()
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
			return
		}

		bio := portfolio.Bio
		interestsToUse := input.Interests
		if len(interestsToUse) == 0 && len(portfolio.Interests) > 0 {
			interestsToUse = portfolio.Interests
		}
		
		if len(interestsToUse) > 0 {
			bio = fmt.Sprintf("%s (Интересы: %s)", bio, strings.Join(interestsToUse, ", "))
		}

		achStr := "{}"
		if portfolio.Achievements != nil {
			achStr = string(portfolio.Achievements)
		}

		prompt := fmt.Sprintf(`Ты — экспертный карьерный консультант Talap. Проанализируй портфолио пользователя:
ЕНТ: %s
Английский: %s
О себе: %s
Навыки: %v
Достижения: %s

Твоя задача — составить подробный карьерный маршрут. 
Отвечай СТРОГО в формате JSON:
{
  "top_profession": "Название идеальной профессии",
  "summary": "Краткое описание почему это подходит и что делать дальше",
  "roadmap": [
    {"step": "1", "duration": "1 месяц", "title": "Шаг 1", "description": "Описание"}
  ],
  "professions": [
    {"name": "Профессия", "description": "Почему подходит", "match_percentage": 95}
  ],
  "grants": [
    {"name": "Название гранта", "description": "Почему подходит", "match_percentage": 88}
  ]
}`, portfolio.ENT, portfolio.English, bio, portfolio.Skills, achStr)

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
			Model: llmModel(),
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "AI error: " + err.Error()})
			return
		}

		raw := strings.TrimSpace(resp.Choices[0].Message.Content)
		raw = strings.TrimPrefix(raw, "```json")
		raw = strings.TrimPrefix(raw, "```")
		raw = strings.TrimSuffix(raw, "```")
		raw = strings.TrimSpace(raw)

		var result struct {
			TopProf     string `json:"top_profession"`
			Summary     string `json:"summary"`
			Roadmap     any    `json:"roadmap"`
			Professions any    `json:"professions"`
			Grants      any    `json:"grants"`
		}
		if err := json.Unmarshal([]byte(raw), &result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response"})
			return
		}

		db.FirstOrCreate(&portfolio, models.Portfolio{UserID: uid})
		resJSON, _ := json.Marshal(result)
		db.Model(&portfolio).Updates(models.Portfolio{
			AIResult:  resJSON,
			UpdatedAt: time.Now(),
		})

		c.JSON(http.StatusOK, result)
	}
}

var (
	lastRequestTime = make(map[uint]time.Time)
	rateLimitMutex  = &sync.Mutex{}
)

func AIChat(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			ThreadID uint   `json:"thread_id"`
			Message  string `json:"message"`
			UserInfo struct {
				Name    string `json:"name"`
				Grade   string `json:"grade"`
				City    string `json:"city"`
				Summary string `json:"summary"`
				TopProf string `json:"top_profession"`
			} `json:"user_info"`
			History []map[string]string `json:"history"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Printf("AIChat Bind Error: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		uid, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user context"})
			return
		}

		rateLimitMutex.Lock()
		last, ok := lastRequestTime[uid]
		if ok && time.Since(last) < 2*time.Second {
			rateLimitMutex.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Пожалуйста, подождите немного перед следующим сообщением"})
			return
		}
		lastRequestTime[uid] = time.Now()
		rateLimitMutex.Unlock()

		var thread models.ChatThread
		if input.ThreadID != 0 {
			db.Where("id = ? AND user_id = ?", input.ThreadID, uid).First(&thread)
		}
		if thread.ID == 0 {
			thread = models.ChatThread{
				UserID:    uid,
				Title:     input.Message[:min(30, len(input.Message))],
				UpdatedAt: time.Now(),
			}
			db.Create(&thread)
		}

		db.Create(&models.ChatMessage{
			ThreadID: thread.ID,
			Role:     "user",
			Content:  input.Message,
		})

		var portfolio models.Portfolio
		db.Where("user_id = ?", uid).First(&portfolio)

		achStr := "[]"
		if len(portfolio.Achievements) > 0 {
			achStr = string(portfolio.Achievements)
		}

		portfolioStatus := fmt.Sprintf(`
БИО: %s
ЕНТ: %s
АНГЛИЙСКИЙ: %s
НАВЫКИ: %v
ДОСТИЖЕНИЯ: %s`, 
		portfolio.Bio, portfolio.ENT, portfolio.English, portfolio.Skills, achStr)

		currentDate := time.Now().Format("02 January 2006")
		systemPrompt := fmt.Sprintf(`Ты — экспертный ИИ-советник Talap. 
СЕГОДНЯ: %s.
ЯЗЫК: Отвечай СТРОГО на том же языке, на котором пишет пользователь (RU, KZ или EN).

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
- Имя: %s
- Класс: %s
- Город: %s
- Анализ профиля: %s
- Текущая профессия-цель: %s

ПОЛНОЕ ПОРТФОЛИО ИЗ БАЗЫ:
%s

ЦЕЛЬ: Помочь пользователю в карьере, образовании и поиске грантов.
ОСОБАЯ ЗАДАЧА: Автоматическое составление идеального CV (резюме).

ЭТАЛОН СТРУКТУРЫ CV (на основе шаблона Vlad Mishustin):
1. Заголовок: ФИО | Телефон | Email | Ссылки (LinkedIn/GitHub/Портфолио)
2. Tagline: Краткий экспертный заголовок (например: "Junior Frontend Developer | React | 3+ Проекта")
3. PROFESSIONAL EXPERIENCE / PROJECTS:
   - Название компании или Проекта | Роль | Даты
   - Краткое описание компании/проекта
   - Достижения (ОБЯЗАТЕЛЬНО: использование цифр и глаголов действия, например: "Увеличил скорость загрузки на 40%%", "Разработал систему с нуля")
   - Stack: Технологии
4. ACHIEVEMENTS: Хакатоны, олимпиады, призы, каналы, выступления.
5. EDUCATION: ВУЗ/Школа, специальность, даты.
6. LANGUAGES & HOBBIES.

ТВОЯ ЛОГИКА СБОРА ИНФОРМАЦИИ:
1. Проверь, достаточно ли у тебя данных для составления CV. Тебе нужно:
   - Контакты (телефон, ссылки)
   - Опыт (минимум 1-2 проекта или места работы с деталями)
   - Достижения (что-то конкретное, кроме учебы)
   - Навыки (стек технологий)
2. Если данных НЕТ в портфолио, ТЫ ДОЛЖЕН вежливо и профессионально спросить их в ходе беседы.
3. Если данных ДОСТАТОЧНО (или пользователь просит CV), ты ОБЯЗАН заполнить объект "cv_data" в ответе.
4. Если ты видишь, что пользователь рассказал о новом проекте или навыке — сразу обнови "cv_data" и предложи скачать обновленное резюме.

КРИТИЧЕСКИЕ ПРАВИЛА:
1. Используй всю информацию из ПОРТФОЛИО.
2. НИКОГДА не спрашивай то, что уже известно.
3. Текст CV должен быть ВПЕЧАТЛЯЮЩИМ (как у Vlad Mishustin) — используй сильные глаголы (Designed, Launched, Optimized, Migrated).
4. Возвращай "cv_data" ТОЛЬКО когда есть реальное наполнение.

ОТВЕЧАЙ СТРОГО В JSON: 
{
  "message": "...", 
  "roadmap": [...],
  "cv_data": {
    "name": "...",
    "contact": "Phone | Email | Links",
    "tagline": "...",
    "summary": "...",
    "experience": [
      {
        "company": "...",
        "role": "...",
        "period": "...",
        "description": "...",
        "achievements": ["...", "..."],
        "stack": "..."
      }
    ],
    "education": [{"school": "...", "degree": "...", "period": "..."}],
    "skills": ["...", "..."],
    "achievements_list": ["...", "..."],
    "languages": "...",
    "hobbies": "..."
  } или null
}`, 
		currentDate, input.UserInfo.Name, input.UserInfo.Grade, input.UserInfo.City, input.UserInfo.Summary, input.UserInfo.TopProf, portfolioStatus)

		msgs := []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleSystem, Content: systemPrompt},
		}
		for _, h := range input.History {
			role := openai.ChatMessageRoleUser
			if h["role"] == "assistant" { role = openai.ChatMessageRoleAssistant }
			msgs = append(msgs, openai.ChatCompletionMessage{Role: role, Content: h["content"]})
		}
		msgs = append(msgs, openai.ChatCompletionMessage{Role: openai.ChatMessageRoleUser, Content: input.Message})

		client, err := openaiClient()
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()
		resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
			Model:    llmModel(),
			Messages: msgs,
			ResponseFormat: &openai.ChatCompletionResponseFormat{Type: openai.ChatCompletionResponseFormatTypeJSONObject},
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "AI failed: " + err.Error()})
			return
		}

		raw := strings.TrimSpace(resp.Choices[0].Message.Content)
		raw = strings.TrimPrefix(raw, "```json")
		raw = strings.TrimPrefix(raw, "```")
		raw = strings.TrimSuffix(raw, "```")
		raw = strings.TrimSpace(raw)

		var result struct {
			Message string `json:"message"`
			Roadmap any    `json:"roadmap"`
			CVData  any    `json:"cv_data"`
		}
		if err := json.Unmarshal([]byte(raw), &result); err != nil {
			log.Printf("AI response not valid JSON, using raw text. Error: %v", err)
			result.Message = raw
		}
		if result.Message == "" {
			result.Message = raw
		}

		rmJSON, _ := json.Marshal(result.Roadmap)
		cvJSON, _ := json.Marshal(result.CVData)
		db.Create(&models.ChatMessage{
			ThreadID: thread.ID,
			Role:     "assistant",
			Content:  result.Message,
			Roadmap:  rmJSON,
			CVData:   cvJSON,
		})
		db.Model(&thread).Update("updated_at", time.Now())

		c.JSON(http.StatusOK, gin.H{
			"thread_id": thread.ID,
			"message":   result.Message,
			"roadmap":   result.Roadmap,
			"cv_data":   result.CVData,
		})
	}
}

func GetChatThreads(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		uid, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user context"})
			return
		}
		threads := []models.ChatThread{}
		db.Where("user_id = ?", uid).Order("updated_at desc").Find(&threads)
		c.JSON(http.StatusOK, threads)
	}
}

func GetChatMessages(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		uid, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user context"})
			return
		}
		threadID := c.Param("id")
		
		var thread models.ChatThread
		if err := db.Where("id = ? AND user_id = ?", threadID, uid).First(&thread).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}

		messages := []models.ChatMessage{}
		db.Where("thread_id = ?", threadID).Order("created_at asc").Find(&messages)
		c.JSON(http.StatusOK, messages)
	}
}

func min(a, b int) int {
	if a < b { return a }
	return b
}
