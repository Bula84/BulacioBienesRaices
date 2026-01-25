-- =====================================================
-- ANTIGRAVITY ENTERPRISE - DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pending' CHECK (role IN ('pending', 'admin', 'superadmin')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- SuperAdmins can view all roles
CREATE POLICY "SuperAdmins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- SuperAdmins can manage all roles
CREATE POLICY "SuperAdmins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Users can create their own pending role on registration
CREATE POLICY "Users can create pending role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'pending');

-- =====================================================
-- PROPIEDADES (Properties) Table
-- =====================================================
CREATE TABLE IF NOT EXISTS propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
  type TEXT NOT NULL,
  m2 INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  coords_lat NUMERIC,
  coords_lng NUMERIC,
  image_url TEXT,
  images TEXT[],
  address TEXT,
  city TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Public can read all properties
CREATE POLICY "Allow public read access on propiedades" ON propiedades
  FOR SELECT USING (true);

-- SuperAdmins can do everything
CREATE POLICY "SuperAdmins full access on propiedades" ON propiedades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Admins can insert their own properties
CREATE POLICY "Admins can insert own propiedades" ON propiedades
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Admins can update their own properties
CREATE POLICY "Admins can update own propiedades" ON propiedades
  FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Admins can delete their own properties
CREATE POLICY "Admins can delete own propiedades" ON propiedades
  FOR DELETE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- =====================================================
-- NOTICIAS (News) Table - SuperAdmin only
-- =====================================================
CREATE TABLE IF NOT EXISTS noticias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Public can read all news
CREATE POLICY "Allow public read access on noticias" ON noticias
  FOR SELECT USING (true);

-- Only SuperAdmins can manage news
CREATE POLICY "SuperAdmins full access on noticias" ON noticias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- =====================================================
-- SERVICIOS (Services) Table - SuperAdmin only
-- =====================================================
CREATE TABLE IF NOT EXISTS servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  skill_tags TEXT[],
  contact TEXT,
  phone TEXT,
  email TEXT,
  rating NUMERIC DEFAULT 5 CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  category TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Public can read all services
CREATE POLICY "Allow public read access on servicios" ON servicios
  FOR SELECT USING (true);

-- Only SuperAdmins can manage services
CREATE POLICY "SuperAdmins full access on servicios" ON servicios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- =====================================================
-- TRIGGER: Auto-create pending role on new user signup
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- SETUP SUPERADMIN
-- Replace 'gerbula84@gmail.com' with your email
-- Run this AFTER you have registered your account
-- =====================================================
INSERT INTO user_roles (user_id, email, role)
SELECT id, email, 'superadmin' 
FROM auth.users 
WHERE email = 'gerbula84@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';
