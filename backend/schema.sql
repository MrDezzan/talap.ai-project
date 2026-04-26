-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grants table
CREATE TABLE grants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    match_percentage INTEGER DEFAULT 0,
    deadline_days INTEGER,
    tone VARCHAR(50) DEFAULT 'success'
);

-- Professions table
CREATE TABLE professions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100)
);

-- User Portfolios
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    skills TEXT[],
    education JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for testing
INSERT INTO grants (name, subtitle, match_percentage, deadline_days, tone) VALUES
('Болашак', 'Магистратура · США/Европа', 87, 12, 'success'),
('NU Foundation', 'Бакалавриат · Назарбаев Университет', 74, 24, 'success'),
('KIMEP Merit', 'Бакалавриат · KIMEP', 68, 5, 'warn');
