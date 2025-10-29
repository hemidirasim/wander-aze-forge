-- ============================================
-- Bookings Table Migration SQL
-- ============================================
-- Bu SQL kodunu PostgreSQL database-də çalışdırın
-- Booking form məlumatlarını saxlamaq üçün table yaradacaq

-- 1. Bookings table yaradırıq (əgər mövcud deyilsə)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- Optional - can be null
  tour_id INTEGER NOT NULL,
  tour_title VARCHAR(255) NOT NULL,
  tour_category VARCHAR(100),
  group_size INTEGER NOT NULL,
  tour_price VARCHAR(100),
  
  -- Contact Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country VARCHAR(100),
  
  -- Booking Details
  preferred_date DATE,
  alternative_date DATE,
  pickup_location TEXT,
  inform_later BOOLEAN DEFAULT false,
  special_requests TEXT,
  
  -- Agreement
  booking_request BOOLEAN NOT NULL DEFAULT false,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  
  -- Status and tracking
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  total_price DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Əgər table artıq mövcuddursa, user_id column-unu nullable et
DO $$ 
BEGIN
  -- Check if user_id column exists and has NOT NULL constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'user_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;
  END IF;
  
  -- If user_id column doesn't exist, add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN user_id INTEGER;
  END IF;
END $$;

-- 2. Index-lər əlavə edirik (performance üçün)
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- 3. Yoxlama: table və column-ların mövcud olduğunu yoxlayırıq
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
