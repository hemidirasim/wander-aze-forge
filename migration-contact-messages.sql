-- ============================================
-- Contact Messages Table Migration SQL
-- ============================================
-- Bu SQL kodunu PostgreSQL database-də çalışdırın
-- Bütün lazım olan column-ları əlavə edəcək

-- 1. Əgər table mövcud deyilsə, yaradırıq
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Lazım olan column-ları əlavə edirik
-- Hər bir column əvvəlcə yoxlanılır, əgər yoxdursa əlavə olunur

-- Ad column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);

-- Soyad column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Ölkə column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Tour Category column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS tour_category VARCHAR(100);

-- Tour Type column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS tour_type VARCHAR(255);

-- Group Size column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS group_size INTEGER;

-- Dates column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS dates VARCHAR(255);

-- Newsletter column-u
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS newsletter BOOLEAN DEFAULT false;

-- ============================================
-- Yoxlama: bütün column-ların siyahısı
-- ============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'contact_messages'
ORDER BY ordinal_position;

