-- ============================================
-- Tailor Made Requests Table Migration SQL
-- ============================================
-- Bu SQL kodunu PostgreSQL database-də çalışdırın
-- Tailor-made form məlumatlarını saxlamaq üçün table yaradacaq

-- 1. Tailor-made requests table yaradırıq
CREATE TABLE IF NOT EXISTS tailor_made_requests (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  adventure_types TEXT[] NOT NULL, -- Array of adventure types
  destinations TEXT NOT NULL,
  start_date DATE NOT NULL,
  duration VARCHAR(100) NOT NULL,
  daily_kilometers VARCHAR(100) NOT NULL,
  number_of_people VARCHAR(100) NOT NULL,
  children_ages TEXT,
  accommodation_preferences TEXT[] NOT NULL, -- Array of accommodation types
  budget VARCHAR(255) NOT NULL,
  additional_details TEXT NOT NULL,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Index-lər əlavə edirik (performance üçün)
CREATE INDEX IF NOT EXISTS idx_tailor_made_requests_email ON tailor_made_requests(email);
CREATE INDEX IF NOT EXISTS idx_tailor_made_requests_status ON tailor_made_requests(status);
CREATE INDEX IF NOT EXISTS idx_tailor_made_requests_created_at ON tailor_made_requests(created_at);

-- 3. Yoxlama: table və column-ların mövcud olduğunu yoxlayırıq
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'tailor_made_requests'
ORDER BY ordinal_position;
