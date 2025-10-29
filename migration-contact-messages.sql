-- ============================================
-- Contact Messages Table Migration SQL
-- ============================================
-- Bu SQL kodunu PostgreSQL database-də çalışdırın
-- Bütün lazım olan column-ları əlavə edəcək

-- 1. Əgər table mövcud deyilsə, yaradırıq (bütün column-larla birlikdə)
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  tour_category VARCHAR(100),
  tour_type VARCHAR(255),
  group_size INTEGER,
  dates VARCHAR(255),
  message TEXT NOT NULL,
  newsletter BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Əgər table artıq mövcuddursa, lazım olan column-ları əlavə edirik
-- Hər bir column üçün əvvəlcə yoxlanılır, əgər yoxdursa əlavə olunur

-- Ad column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN first_name VARCHAR(255);
  END IF;
END $$;

-- Soyad column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN last_name VARCHAR(255);
  END IF;
END $$;

-- Ölkə column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'country'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN country VARCHAR(100);
  END IF;
END $$;

-- Tour Category column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'tour_category'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN tour_category VARCHAR(100);
  END IF;
END $$;

-- Tour Type column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'tour_type'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN tour_type VARCHAR(255);
  END IF;
END $$;

-- Group Size column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'group_size'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN group_size INTEGER;
  END IF;
END $$;

-- Dates column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'dates'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN dates VARCHAR(255);
  END IF;
END $$;

-- Newsletter column-u
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'newsletter'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN newsletter BOOLEAN DEFAULT false;
  END IF;
END $$;

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

