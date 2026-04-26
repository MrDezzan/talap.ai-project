import psycopg2
import sys

def setup_db():
    conn_params = {
        "host": "a1-postgres1.alem.ai",
        "port": 30100,
        "user": "heelllo2077",
        "password": "0a8bZcMVi7",
        "dbname": "aiszoomersdb"
    }

    conn = None
    try:
        conn = psycopg2.connect(**conn_params)
        conn.autocommit = True
        cur = conn.cursor()

        print("Wiping existing tables...")
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        for table in tables:
            cur.execute(f"DROP TABLE IF EXISTS {table[0]} CASCADE")

        print("Creating new schema...")
        cur.execute("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE grants (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            match_percentage INTEGER DEFAULT 0,
            deadline_days INTEGER,
            tone VARCHAR(50) DEFAULT 'success',
            country VARCHAR(100),
            amount VARCHAR(100),
            description TEXT,
            tags TEXT[] DEFAULT '{}'
        );

        CREATE TABLE professions (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            tags TEXT[] DEFAULT '{}',
            salary VARCHAR(100),
            growth VARCHAR(50),
            match_percentage INTEGER DEFAULT 0,
            hot BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE portfolios (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            skills TEXT[],
            achievements JSONB DEFAULT '[]',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """)

        print("Seeding grants...")
        cur.execute("""
        INSERT INTO grants (name, subtitle, match_percentage, deadline_days, tone, country, amount, description, tags) VALUES
        ('Болашак', 'Правительственная программа', 87, 12, 'warn', 'США / UK / Европа', 'Полное покрытие', 'Президентская программа для обучения в лучших университетах мира. Покрывает обучение, проживание и перелёт.', ARRAY['Магистратура', 'Бакалавриат', 'За рубежом']),
        ('NU Foundation Grant', 'Назарбаев Университет', 74, 24, 'success', 'Казахстан', 'до 100% стоимости обучения', 'Грант на обучение в Назарбаев Университете для лучших абитуриентов Казахстана.', ARRAY['Бакалавриат', 'Казахстан', 'IT']),
        ('KIMEP Merit Award', 'KIMEP University', 68, 5, 'warn', 'Казахстан', 'от 25% до 100%', 'Конкурсный грант для студентов с высокими академическими показателями.', ARRAY['Бакалавриат', 'Казахстан', 'Бизнес']),
        ('Erasmus Mundus', 'Европейский союз', 61, 38, 'success', 'Европа', 'от €1 000/мес', 'Стипендиальная программа ЕС для обучения в двух и более европейских университетах.', ARRAY['Магистратура', 'За рубежом']),
        ('DAAD Scholarship', 'Германская служба академических обменов', 92, 45, 'success', 'Германия', 'от €850/мес', 'Одна из крупнейших мировых программ академических обменов. Высокий конкурс, отличные условия.', ARRAY['Магистратура', 'За рубежом', 'Наука']),
        ('Fulbright Program', 'Правительство США', 45, 60, 'success', 'США', 'Полное покрытие', 'Престижная американская программа для выдающихся студентов и исследователей.', ARRAY['Магистратура', 'За рубежом']),
        ('Türkiye Bursları', 'Правительство Турции', 78, 15, 'warn', 'Турция', 'Полное покрытие + $700/мес', 'Полная стипендия правительства Турции: обучение, проживание, питание и карманные деньги.', ARRAY['Бакалавриат', 'Магистратура', 'За рубежом']),
        ('MEXT Scholarship', 'Правительство Японии', 55, 90, 'success', 'Япония', '¥143 000/мес', 'Японская правительственная стипендия для иностранных студентов. Включает обучение и стипендию.', ARRAY['Бакалавриат', 'Магистратура', 'За рубежом', 'Наука']),
        ('Chevening', 'Правительство Великобритании', 82, 30, 'success', 'Великобритания', 'Полное покрытие', 'Британская программа для будущих лидеров. Полная стипендия для обучения в любом вузе UK.', ARRAY['Магистратура', 'За рубежом']);
        """)

        print("Seeding professions...")
        cur.execute("""
        INSERT INTO professions (name, description, category, tags, salary, growth, match_percentage, hot) VALUES
        ('Software Engineer', 'Разрабатывает приложения, сервисы и платформы. Один из самых востребованных специалистов в Казахстане и в мире.', 'IT и данные', ARRAY['IT', 'Backend', 'Frontend'], 'от 450 000 ₸', '+32%', 92, TRUE),
        ('Data Scientist', 'Анализирует большие массивы данных, строит модели машинного обучения и находит бизнес-инсайты.', 'IT и данные', ARRAY['IT', 'ML', 'Аналитика'], 'от 550 000 ₸', '+41%', 88, TRUE),
        ('ML Engineer', 'Разрабатывает и разворачивает модели машинного обучения в продакшене. Синтез data science и инженерии.', 'IT и данные', ARRAY['IT', 'AI', 'ML'], 'от 700 000 ₸', '+55%', 85, TRUE),
        ('Cybersecurity Analyst', 'Защищает системы и данные от кибератак. Высокий спрос в банковском и государственном секторе.', 'IT и данные', ARRAY['IT', 'Security', 'Сети'], 'от 500 000 ₸', '+38%', 79, FALSE),
        ('DevOps Engineer', 'Автоматизирует развёртывание и инфраструктуру, обеспечивает CI/CD-процессы.', 'IT и данные', ARRAY['IT', 'Cloud', 'Linux'], 'от 600 000 ₸', '+44%', 81, TRUE),
        ('UX/UI Designer', 'Проектирует пользовательские интерфейсы и опыт взаимодействия. Работает на стыке дизайна и психологии.', 'Дизайн', ARRAY['Дизайн', 'Figma', 'UX'], 'от 350 000 ₸', '+25%', 76, FALSE),
        ('Graphic Designer', 'Создаёт визуальные материалы: логотипы, брендинг, рекламные материалы и иллюстрации.', 'Дизайн', ARRAY['Дизайн', 'Figma', 'Illustrator'], 'от 200 000 ₸', '+12%', 65, FALSE),
        ('Motion Designer', 'Создаёт анимации, видеоролики и интерактивные визуальные эффекты для брендов и медиа.', 'Дизайн', ARRAY['Дизайн', 'After Effects', 'Анимация'], 'от 300 000 ₸', '+19%', 70, TRUE),
        ('Architect', 'Проектирует здания и пространства, совмещая функциональность, эстетику и инженерные решения.', 'Дизайн', ARRAY['Дизайн', 'Инженерия', 'AutoCAD'], 'от 400 000 ₸', '+16%', 73, FALSE),
        ('Product Manager', 'Управляет развитием продукта: от идеи до запуска. Координирует дизайнеров, разработчиков и бизнес.', 'Бизнес', ARRAY['Бизнес', 'Agile', 'Стратегия'], 'от 500 000 ₸', '+28%', 83, FALSE),
        ('Marketing Specialist', 'Продвигает продукты и услуги, анализирует рынок, запускает рекламные кампании.', 'Бизнес', ARRAY['Бизнес', 'SMM', 'Аналитика'], 'от 250 000 ₸', '+15%', 72, FALSE),
        ('Financial Analyst', 'Анализирует финансовые показатели компаний, строит модели и помогает принимать инвестиционные решения.', 'Бизнес', ARRAY['Бизнес', 'Финансы', 'Excel'], 'от 400 000 ₸', '+18%', 74, FALSE),
        ('Entrepreneur', 'Создаёт собственный бизнес, управляет стартапом, привлекает инвестиции и строит команду.', 'Бизнес', ARRAY['Бизнес', 'Стартап', 'Лидерство'], 'от 0 до ∞', '+30%', 68, TRUE),
        ('Civil Engineer', 'Проектирует и контролирует строительство зданий, мостов, дорог и инфраструктуры.', 'Инженерия', ARRAY['Инженерия', 'AutoCAD', 'Строительство'], 'от 350 000 ₸', '+14%', 69, FALSE),
        ('Mechanical Engineer', 'Разрабатывает механические системы, машины и оборудование для различных отраслей.', 'Инженерия', ARRAY['Инженерия', 'SolidWorks', 'Физика'], 'от 320 000 ₸', '+11%', 64, FALSE),
        ('Electrical Engineer', 'Проектирует электрические системы, схемы и энергетические решения.', 'Инженерия', ARRAY['Инженерия', 'Электроника', 'MATLAB'], 'от 380 000 ₸', '+16%', 67, FALSE),
        ('Petroleum Engineer', 'Разрабатывает методы добычи нефти и газа, оптимизирует производственные процессы.', 'Инженерия', ARRAY['Инженерия', 'Нефтегаз', 'Геология'], 'от 800 000 ₸', '+8%', 75, FALSE),
        ('Medical Doctor', 'Диагностирует и лечит заболевания, ведёт пациентов. Требует длительного обучения и практики.', 'Медицина', ARRAY['Медицина', 'Биология', 'Химия'], 'от 300 000 ₸', '+20%', 71, FALSE),
        ('Biomedical Researcher', 'Проводит научные исследования в области медицины и биологии, разрабатывает новые методы лечения.', 'Наука', ARRAY['Наука', 'Биология', 'Исследования'], 'от 400 000 ₸', '+22%', 66, TRUE),
        ('Chemist', 'Исследует вещества, разрабатывает новые материалы и химические процессы для промышленности.', 'Наука', ARRAY['Наука', 'Химия', 'Лаборатория'], 'от 280 000 ₸', '+10%', 62, FALSE),
        ('Physicist', 'Изучает фундаментальные законы природы, работает в исследовательских лабораториях и университетах.', 'Наука', ARRAY['Наука', 'Физика', 'Математика'], 'от 350 000 ₸', '+13%', 64, FALSE),
        ('Teacher', 'Обучает и вдохновляет учеников, передаёт знания и формирует ценности следующего поколения.', 'Образование', ARRAY['Образование', 'Педагогика', 'Коммуникация'], 'от 150 000 ₸', '+10%', 60, FALSE),
        ('Educational Psychologist', 'Помогает детям и студентам справляться с учебными трудностями, исследует процессы обучения.', 'Образование', ARRAY['Образование', 'Психология', 'Педагогика'], 'от 250 000 ₸', '+17%', 68, FALSE),
        ('Journalist', 'Собирает и публикует новости, проводит расследования, ведёт блоги и подкасты.', 'Образование', ARRAY['Медиа', 'Письмо', 'Коммуникация'], 'от 200 000 ₸', '+8%', 58, FALSE);
        """)

        print("Seeding users and portfolios...")
        cur.execute("""
        INSERT INTO users (name, email, password_hash) VALUES
        ('Айдана Серикова', 'aidana@example.com', '$2a$10$nFkm1gQJkH8PLMV2MNlRXuJjmPrqNzGiQ8BLqMwO3jvP4cHY1zWKS'),
        ('Даниял Сейткали', 'daniyal@example.com', '$2a$10$nFkm1gQJkH8PLMV2MNlRXuJjmPrqNzGiQ8BLqMwO3jvP4cHY1zWKS');

        INSERT INTO portfolios (user_id, bio, skills, achievements) VALUES
        (1, 'Ученица 11 класса, увлекаюсь математикой и программированием. Мечтаю поступить в топовый вуз.', 
            ARRAY['Python', 'Математика', 'Английский', 'Git'],
            '[{"id":1,"title":"Олимпиада по физике","org":"Министерство образования РК","year":"2024","icon":"award","tone":"blue"},{"id":2,"title":"Хакатон Digital Bridge","org":"МЦРИАП","year":"2024","icon":"trophy","tone":"success"}]'),
        (2, 'Студент 2 курса НУ, занимаюсь анализом данных. Ищу возможности для стажировки за рубежом.', 
            ARRAY['Python', 'SQL', 'Machine Learning', 'Tableau', 'English'],
            '[{"id":1,"title":"Hackathon Winner 2024","org":"Nazarbayev University","year":"2024","icon":"trophy","tone":"blue"},{"id":2,"title":"Best Research Paper","org":"NU School of Science","year":"2023","icon":"bookOpen","tone":"iris"}]');
        """)

        print("\n✅ Database setup complete!")
        cur.execute("SELECT COUNT(*) FROM grants")
        print(f"   Grants: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM professions")
        print(f"   Professions: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM users")
        print(f"   Users: {cur.fetchone()[0]}")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_db()
