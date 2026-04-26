package config

import (
	"talkd-backend/models"
	"gorm.io/gorm"
	"log"
	"github.com/lib/pq"
)

func SeedDB(db *gorm.DB) {
	log.Println("Seeding database with fresh mock data...")

	// Clear existing to ensure sync with frontend filters
	db.Exec("DELETE FROM professions")
	db.Exec("DELETE FROM grants")

	log.Println("Seeding professions...")
	professions := []models.Profession{
		{Name: "Software Engineer", Description: "Разрабатывает приложения и системы. Включает работу с Backend, Frontend и мобильной разработкой.", Category: "IT и данные", Tags: pq.StringArray{"IT", "Programming"}, Salary: "от 600 000 ₸", Growth: "+32%", MatchPercentage: 92, Hot: true},
		{Name: "Data Scientist", Description: "Анализирует данные и строит модели ML для решения бизнес-задач и прогнозирования.", Category: "IT и данные", Tags: pq.StringArray{"IT", "Math", "AI"}, Salary: "от 750 000 ₸", Growth: "+41%", MatchPercentage: 88, Hot: true},
		{Name: "UX/UI Designer", Description: "Проектирует удобные и красивые интерфейсы для веб-сайтов и мобильных приложений.", Category: "Дизайн", Tags: pq.StringArray{"Design", "Creativity"}, Salary: "от 400 000 ₸", Growth: "+25%", MatchPercentage: 76, Hot: false},
		{Name: "Product Manager", Description: "Управляет развитием продукта от идеи до запуска и масштабирования.", Category: "Бизнес", Tags: pq.StringArray{"Business", "Management"}, Salary: "от 700 000 ₸", Growth: "+28%", MatchPercentage: 83, Hot: true},
		{Name: "AI Specialist", Description: "Разрабатывает и обучает нейросети для автоматизации процессов и создания новых технологий.", Category: "IT и данные", Tags: pq.StringArray{"AI", "Python"}, Salary: "от 850 000 ₸", Growth: "+55%", MatchPercentage: 85, Hot: true},
		{Name: "Cybersecurity Analyst", Description: "Обеспечивает информационную безопасность систем и защиту от кибератак.", Category: "IT и данные", Tags: pq.StringArray{"IT", "Security"}, Salary: "от 650 000 ₸", Growth: "+38%", MatchPercentage: 79, Hot: true},
		{Name: "Mobile Developer", Description: "Создает приложения для iOS и Android на современных языках программирования.", Category: "IT и данные", Tags: pq.StringArray{"IT", "Mobile"}, Salary: "от 550 000 ₸", Growth: "+30%", MatchPercentage: 84, Hot: true},
		{Name: "Medical Doctor", Description: "Проводит диагностику и лечение заболеваний, заботясь о здоровье пациентов.", Category: "Медицина", Tags: pq.StringArray{"Medicine", "Stable"}, Salary: "от 350 000 ₸", Growth: "+20%", MatchPercentage: 71, Hot: false},
		{Name: "Civil Engineer", Description: "Проектирует и руководит строительством зданий, дорог и других объектов инфраструктуры.", Category: "Инженерия", Tags: pq.StringArray{"Engineering", "Construction"}, Salary: "от 400 000 ₸", Growth: "+15%", MatchPercentage: 68, Hot: false},
		{Name: "Marketing Director", Description: "Разрабатывает маркетинговую стратегию и управляет рекламными кампаниями бренда.", Category: "Бизнес", Tags: pq.StringArray{"Marketing", "Ads"}, Salary: "от 600 000 ₸", Growth: "+22%", MatchPercentage: 75, Hot: true},
	}
	for _, p := range professions {
		db.Create(&p)
	}

	log.Println("Seeding grants...")
	grants := []models.Grant{
		{Name: "Болашак", Subtitle: "Международная стипендия", MatchPercentage: 87, DeadlineDays: 12, Tone: "warn", Country: "За рубежом", Amount: "100% покрытие", Description: "Престижная государственная стипендия для обучения в лучших вузах мира. Покрывает все расходы.", Tags: pq.StringArray{"За рубежом", "Магистратура", "Бакалавриат"}},
		{Name: "NU Foundation", Subtitle: "Назарбаев Университет", MatchPercentage: 74, DeadlineDays: 24, Tone: "success", Country: "Казахстан", Amount: "Полный грант", Description: "Подготовительная программа Foundation в ведущем исследовательском вузе Казахстана.", Tags: pq.StringArray{"Казахстан", "Бакалавриат"}},
		{Name: "AITU Talent Grant", Subtitle: "Astana IT University", MatchPercentage: 92, DeadlineDays: 15, Tone: "success", Country: "Казахстан", Amount: "Полный грант", Description: "Специальный грант для талантливых абитуриентов, поступающих на IT-специальности в AITU.", Tags: pq.StringArray{"Казахстан", "IT", "Бакалавриат"}},
		{Name: "Suleyman Demirel University Grant", Subtitle: "SDU internal grant", MatchPercentage: 81, DeadlineDays: 30, Tone: "success", Country: "Казахстан", Amount: "100% скидка", Description: "Внутренняя стипендия SDU для победителей олимпиад и за высокие баллы ЕНТ.", Tags: pq.StringArray{"Казахстан", "Бизнес", "Бакалавриат"}},
		{Name: "Turkiye Burslari", Subtitle: "Turkey Scholarships", MatchPercentage: 65, DeadlineDays: 45, Tone: "warn", Country: "За рубежом", Amount: "Полное покрытие", Description: "Государственная стипендия Турции для иностранных студентов. Включает обучение и проживание.", Tags: pq.StringArray{"За рубежом", "Бакалавриат", "Магистратура"}},
		{Name: "Google Step Internship", Subtitle: "IT Internship", MatchPercentage: 88, DeadlineDays: 10, Tone: "warn", Country: "За рубежом", Amount: "$5000/мес", Description: "Стажировка в Google для студентов младших курсов, интересующихся разработкой ПО.", Tags: pq.StringArray{"IT", "За рубежом"}},
	}
	for _, g := range grants {
		db.Create(&g)
	}

	log.Println("Seeding complete!")
}
