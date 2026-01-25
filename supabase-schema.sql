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

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own pending role on registration
CREATE POLICY "Users can create pending role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'pending');

-- =====================================================
-- PROPIEDADES (Properties) Table - Extended
-- =====================================================
CREATE TABLE IF NOT EXISTS propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  price NUMERIC NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
  type TEXT NOT NULL,
  m2 INTEGER,
  m2_covered INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  floors INTEGER,
  year_built INTEGER,
  coords_lat NUMERIC,
  coords_lng NUMERIC,
  image_url TEXT,
  images TEXT[],
  address TEXT,
  city TEXT,
  neighborhood TEXT,
  zip_code TEXT,
  -- Amenities
  has_pool BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT FALSE,
  has_balcony BOOLEAN DEFAULT FALSE,
  has_gym BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_laundry BOOLEAN DEFAULT FALSE,
  has_storage BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_heating BOOLEAN DEFAULT FALSE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  -- Contact
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  -- Meta
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Public can read all properties
CREATE POLICY "Allow public read access on propiedades" ON propiedades
  FOR SELECT USING (true);

-- =====================================================
-- NOTICIAS (News) Table
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

-- =====================================================
-- SERVICIOS (Services) Table
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
-- HELPER FUNCTION: Get user role (SECURITY DEFINER to avoid RLS recursion)
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- RLS POLICIES WITH SECURITY DEFINER FUNCTION
-- =====================================================

-- USER_ROLES: SuperAdmins can view all
CREATE POLICY "SuperAdmins can view all roles" ON user_roles
  FOR SELECT USING (public.get_my_role() = 'superadmin');

-- USER_ROLES: SuperAdmins can manage all
CREATE POLICY "SuperAdmins can manage roles" ON user_roles
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- PROPIEDADES: SuperAdmins full access
CREATE POLICY "SuperAdmins full access on propiedades" ON propiedades
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- PROPIEDADES: Admins can insert their own
CREATE POLICY "Admins can insert own propiedades" ON propiedades
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

-- PROPIEDADES: Admins can update their own
CREATE POLICY "Admins can update own propiedades" ON propiedades
  FOR UPDATE USING (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

-- PROPIEDADES: Admins can delete their own
CREATE POLICY "Admins can delete own propiedades" ON propiedades
  FOR DELETE USING (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

-- NOTICIAS: Only SuperAdmins can manage
CREATE POLICY "SuperAdmins full access on noticias" ON noticias
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- SERVICIOS: Only SuperAdmins can manage
CREATE POLICY "SuperAdmins full access on servicios" ON servicios
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- =====================================================
-- SETUP SUPERADMIN (run after registration)
-- Replace email with your SuperAdmin email
-- =====================================================
INSERT INTO user_roles (user_id, email, role)
SELECT id, email, 'superadmin' 
FROM auth.users 
WHERE email = 'gerbula84@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';
