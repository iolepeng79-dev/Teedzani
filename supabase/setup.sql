-- =========================================
-- TourBots Consolidated SQL (Full Setup)
-- =========================================

-- USERS / PROFILES (no passwords here; use Supabase Auth for login)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text NOT NULL, -- 'tourist', 'business', 'admin'
    country text,
    created_at timestamptz DEFAULT now()
);

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

-- ANALYTICS
CREATE TABLE IF NOT EXISTS analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    metric text NOT NULL,
    value numeric NOT NULL,
    timestamp timestamptz DEFAULT now()
);

-- UPLOADS
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

-- Insert default packages if not exists
INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Basic', 0, 0, '{"uploads":{"profile_picture":true,"gallery":false},"analytics":["total_views","inquiries","ratings","clicks"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Basic');

INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Standard', 550, 5000, '{"uploads":{"photos":25,"videos":1},"promotions":2,"analytics":["total_views","inquiries","ratings","clicks","detailed_analytics"],"stories":2}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Standard');

INSERT INTO packages(id, name, price_monthly, price_yearly, features)
SELECT gen_random_uuid(), 'Premium', 750, 6000, '{"uploads":{"photos":50,"videos":4},"promotions":5,"analytics":["total_views","inquiries","ratings","clicks","detailed_analytics"],"stories":5}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name='Premium');

-- Sample Regions & Towns
INSERT INTO regions(name) SELECT 'Gaborone' WHERE NOT EXISTS(SELECT 1 FROM regions WHERE name='Gaborone');
INSERT INTO regions(name) SELECT 'Francistown' WHERE NOT EXISTS(SELECT 1 FROM regions WHERE name='Francistown');
INSERT INTO regions(name) SELECT 'Maun' WHERE NOT EXISTS(SELECT 1 FROM regions WHERE name='Maun');

INSERT INTO towns(region_id,name)
SELECT r.id,'Block 8' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS(SELECT 1 FROM towns t WHERE t.name='Block 8');
INSERT INTO towns(region_id,name)
SELECT r.id,'City Centre' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS(SELECT 1 FROM towns t WHERE t.name='City Centre');
INSERT INTO towns(region_id,name)
SELECT r.id,'Other' FROM regions r WHERE r.name='Gaborone' AND NOT EXISTS(SELECT 1 FROM towns t WHERE t.name='Other');

-- =========================================
-- SAMPLE USERS (TOURIST & BUSINESS)
-- =========================================
-- Create users via Supabase Auth for login
-- Sample tourist
INSERT INTO profiles(full_name,email,role,country)
SELECT 'Sample Tourist','tourist1@tourbots.com','tourist','Botswana'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email='tourist1@tourbots.com');

-- Sample business user
INSERT INTO profiles(full_name,email,role,country)
SELECT 'Sample Business','business1@tourbots.com','business','Botswana'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email='business1@tourbots.com');

-- Sample business attached to the business user
INSERT INTO businesses(profile_id,business_name,category,region,town,phone,email,status)
SELECT p.id,'Sample Lodge','Lodges','Gaborone','Block 8','26771234567','business1@tourbots.com','Approved'
FROM profiles p WHERE p.email='business1@tourbots.com' AND NOT EXISTS (SELECT 1 FROM businesses b WHERE b.profile_id=p.id);

-- Sample analytics for the business
INSERT INTO analytics(business_id,metric,value)
SELECT b.id,'total_views',120 FROM businesses b WHERE b.business_name='Sample Lodge' AND NOT EXISTS(SELECT 1 FROM analytics a WHERE a.business_id=b.id AND metric='total_views');
INSERT INTO analytics(business_id,metric,value)
SELECT b.id,'inquiries',15 FROM businesses b WHERE b.business_name='Sample Lodge' AND NOT EXISTS(SELECT 1 FROM analytics a WHERE a.business_id=b.id AND metric='inquiries');

-- Sample upload for the business
INSERT INTO uploads(business_id,type,filename,description,size_kb)
SELECT b.id,'image','lodge1.jpg','Main view of Sample Lodge',450 FROM businesses b WHERE b.business_name='Sample Lodge' AND NOT EXISTS (SELECT 1 FROM uploads u WHERE u.business_id=b.id AND filename='lodge1.jpg');

-- Sample promotion
INSERT INTO promotions(business_id,type,title,content)
SELECT b.id,'promotion','Summer Special','Get 20% off this season!' FROM businesses b WHERE b.business_name='Sample Lodge' AND NOT EXISTS (SELECT 1 FROM promotions p WHERE p.business_id=b.id AND title='Summer Special');

-- =========================================
-- ADMIN USER via Supabase Auth
-- =========================================
-- Go to Supabase Dashboard -> Authentication -> Users -> Create User
-- Email: admin@tourbots.com
-- Password: admin123
-- Role: admin
-- This ensures proper login credentials handling
