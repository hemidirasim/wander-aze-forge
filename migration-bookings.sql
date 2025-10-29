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

-- Əlavə column-ları əlavə et (əgər yoxdursa)
DO $$ 
BEGIN
  -- tour_title
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'tour_title'
  ) THEN
    ALTER TABLE bookings ADD COLUMN tour_title VARCHAR(255);
  END IF;
  
  -- tour_category
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'tour_category'
  ) THEN
    ALTER TABLE bookings ADD COLUMN tour_category VARCHAR(100);
  END IF;
  
  -- group_size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'group_size'
  ) THEN
    ALTER TABLE bookings ADD COLUMN group_size INTEGER;
  END IF;
  
  -- tour_price
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'tour_price'
  ) THEN
    ALTER TABLE bookings ADD COLUMN tour_price VARCHAR(100);
  END IF;
  
  -- full_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN full_name VARCHAR(255);
  END IF;
  
  -- customer_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_name VARCHAR(255);
  END IF;
  
  -- customer_email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_email VARCHAR(255);
  END IF;
  
  -- customer_phone
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'customer_phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_phone VARCHAR(50);
  END IF;
  
  -- email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'email'
  ) THEN
    ALTER TABLE bookings ADD COLUMN email VARCHAR(255);
  END IF;
  
  -- phone
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN phone VARCHAR(50);
  END IF;
  
  -- country
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'country'
  ) THEN
    ALTER TABLE bookings ADD COLUMN country VARCHAR(100);
  END IF;
  
  -- preferred_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'preferred_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN preferred_date DATE;
    -- If tour_date exists, copy data
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'tour_date'
    ) THEN
      UPDATE bookings SET preferred_date = tour_date WHERE preferred_date IS NULL;
    END IF;
  END IF;
  
  -- alternative_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'alternative_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN alternative_date DATE;
  END IF;
  
  -- pickup_location
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'pickup_location'
  ) THEN
    ALTER TABLE bookings ADD COLUMN pickup_location TEXT;
  END IF;
  
  -- inform_later
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'inform_later'
  ) THEN
    ALTER TABLE bookings ADD COLUMN inform_later BOOLEAN DEFAULT false;
  END IF;
  
  -- booking_request
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'booking_request'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_request BOOLEAN DEFAULT false;
  END IF;
  
  -- terms_accepted
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'terms_accepted'
  ) THEN
    ALTER TABLE bookings ADD COLUMN terms_accepted BOOLEAN DEFAULT false;
  END IF;
  
  -- status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
  END IF;
  
  -- total_price
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'total_price'
  ) THEN
    ALTER TABLE bookings ADD COLUMN total_price DECIMAL(10,2);
  END IF;
  
  -- created_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
  
  -- updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
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
