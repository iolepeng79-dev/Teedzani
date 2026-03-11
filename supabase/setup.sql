-- =========================================
-- TourBots: Consolidated SQL for Supabase
-- =========================================

-- Profiles (tourists & businesses metadata)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('tourist','business','admin')),
    phone TEXT,
    whatsapp TEXT,
    country TEXT,
    region TEXT,
    town TEXT,
    business_name TEXT,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','pending','approved','rejected')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Uploads (business certificates, media)
CREATE TABLE IF NOT EXISTS uploads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK(type IN ('certificate','photo','video')),
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Packages (business subscription levels)
CREATE TABLE IF NOT EXISTS packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    monthly_price NUMERIC,
    yearly_price NUMERIC,
    max_photos INTEGER,
    max_videos INTEGER,
    max_promotions INTEGER,
    max_stories INTEGER,
    analytics_depth TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Business interactions & analytics
CREATE TABLE IF NOT EXISTS interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK(type IN ('call','whatsapp','email','booking')),
    timestamp TIMESTAMP DEFAULT now()
);

-- Reviews & ratings
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    tourist_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK(rating >=1 AND rating <=5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Promotions & stories
CREATE TABLE IF NOT EXISTS promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK(type IN ('promotion','story')),
    title TEXT,
    description TEXT,
    media_url TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Insert default packages
INSERT INTO packages (name, monthly_price, yearly_price, max_photos, max_videos, max_promotions, max_stories, analytics_depth)
VALUES 
('Basic', 0, 0, 1, 0, 0, 0, 'limited'),
('Standard', 550, 5000, 25, 1, 2, 2, 'full'),
('Premium', 750, 6000, 50, 4, 5, 5, 'full')
ON CONFLICT DO NOTHING;
