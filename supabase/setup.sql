-- =========================================
-- TourBots: Consolidated SQL for Supabase
-- =========================================

-- USERS / PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    password text,
    role text NOT NULL, -- 'tourist', 'business', 'admin'
    country text,
    created_at timestamptz DEFAULT now()
);

-- Insert admin user safely
INSERT INTO profiles(id, full_name, email, password, role)
SELECT gen_random_uuid(), 'TourBots Admin','admin@tourbots.com','admin123','admin'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email='admin@tourbots.com');

-- BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    business_name text NOT NULL,
    category text NOT NULL,
    region text NOT NULL,
    town text NOT NULL,
    phone text,
    whatsapp text,
    email text,
    description text,
    status text DEFAULT 'Draft', -- Draft, Pending, Approved, Rejected
    package_id uuid,
    created_at timestamptz DEFAULT now()
);

-- PACKAGES
CREATE TABLE IF NOT EXISTS packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    price_monthly numeric,
    price_yearly numeric,
    features jsonb,
    created_at timestamptz DEFAULT now()
);

-- Insert default packages safely
INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Basic', 0, 0, '{"uploads": {"profile_picture": true, "gallery": false}, "analytics": ["total_views","inquiries","ratings","clicks"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Basic');

INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Standard', 550, 5000, '{"uploads": {"photos":25,"videos":1}, "promotions":2, "analytics":["total_views","inquiries","ratings","clicks","detailed_analytics"], "stories":2}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Standard');

INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Premium', 750, 6000, '{"uploads": {"photos":50,"videos":4}, "promotions":5, "analytics":["total_views","inquiries","ratings","clicks","detailed_analytics"], "stories":5}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Premium');

-- REGIONS & TOWNS
CREATE TABLE IF NOT EXISTS regions (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS towns (
    id serial PRIMARY KEY,
    region_id int REFERENCES regions(id) ON DELETE CASCADE,
    name text NOT NULL
);

-- ANALYTICS
CREATE TABLE IF NOT EXISTS analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    metric text NOT NULL,
    value numeric NOT NULL,
    timestamp timestamptz DEFAULT now()
);

-- UPLOADS (images / pdfs)
CREATE TABLE IF NOT EXISTS uploads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'image', 'pdf', 'video'
    filename text NOT NULL,
    description text,
    size_kb int,
    created_at timestamptz DEFAULT now()
);

-- PROMOTIONS & STORIES
CREATE TABLE IF NOT EXISTS promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'story', 'promotion'
    title text,
    content text,
    media jsonb,
    created_at timestamptz DEFAULT now()
);

-- BUSINESS PACKAGE HISTORY
CREATE TABLE IF NOT EXISTS business_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    package_id uuid REFERENCES packages(id),
    approved boolean DEFAULT false,
    start_date timestamptz DEFAULT now(),
    end_date timestamptz
);

-- Insert sample regions & towns (Botswana)
INSERT INTO regions(name)
SELECT 'Gaborone' WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name='Gaborone');
INSERT INTO regions(name)
SELECT 'Francistown' WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name='Francistown');
INSERT INTO regions(name)
SELECT 'Maun' WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name='Maun');

-- Towns
INSERT INTO towns(region_id, name)
SELECT r.id,'Block 8' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS (SELECT 1 FROM towns t WHERE t.name='Block 8');
INSERT INTO towns(region_id, name)
SELECT r.id,'City Centre' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS (SELECT 1 FROM towns t WHERE t.name='City Centre');
INSERT INTO towns(region_id, name)
SELECT r.id,'Other' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS (SELECT 1 FROM towns t WHERE t.name='Other');
