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

-- SuperAdmins can insert/update/delete roles
CREATE POLICY "SuperAdmins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Users can insert their own pending role on registration
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
-- HELPER FUNCTION: Get user role
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Auto-create pending role on new user
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- INITIAL SUPERADMIN SETUP
-- Run this AFTER creating your superadmin account
-- Replace 'gerbula84@gmail.com' with your email
-- =====================================================
-- INSERT INTO user_roles (user_id, email, role)
-- SELECT id, email, 'superadmin' 
-- FROM auth.users 
-- WHERE email = 'gerbula84@gmail.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';

-- =====================================================
-- SAMPLE DATA (Optional - for demo purposes)
-- =====================================================

-- Sample Properties (no user_id = public demo data)
INSERT INTO propiedades (title, description, price, operation, type, m2, bedrooms, bathrooms, coords_lat, coords_lng, image_url, address, city) VALUES
('Departamento de Lujo en Puerto Madero', 'Espectacular departamento con vista al río.', 450000, 'venta', 'Departamento', 120, 3, 2, -34.6118, -58.3625, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Puerto Madero', 'Buenos Aires'),
('Casa Moderna en Nordelta', 'Casa de diseño contemporáneo con amplio jardín y pileta.', 8500, 'alquiler', 'Casa', 250, 4, 3, -34.4097, -58.6517, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Nordelta', 'Tigre'),
('Penthouse con Vista al Río', 'Exclusivo penthouse en torre de categoría.', 850000, 'venta', 'Penthouse', 200, 4, 3, -34.6037, -58.3816, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Recoleta', 'Buenos Aires');

-- Sample News
INSERT INTO noticias (title, content, excerpt, image_url, author) VALUES
('El mercado inmobiliario muestra signos de recuperación', 'El mercado inmobiliario argentino está experimentando una notable recuperación...', 'Los expertos señalan un incremento del 15% en las transacciones.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Carlos Rodríguez'),
('Nuevas tendencias en diseño de interiores para 2026', 'Las tendencias de diseño incluyen materiales naturales y espacios multifuncionales...', 'Descubre las últimas tendencias en decoración.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', 'María González');

-- Sample Services  
INSERT INTO servicios (name, skill_tags, contact, phone, email, rating, image_url, category, description) VALUES
('Juan Pérez', ARRAY['Instalaciones eléctricas', 'Reparaciones'], '+54 11 1234-5678', '+541112345678', 'juan.perez@email.com', 4.8, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', 'Electricidad', 'Electricista matriculado con más de 15 años de experiencia.'),
('Roberto Gómez', ARRAY['Plomería general', 'Gas'], '+54 11 2345-6789', '+541123456789', 'roberto@plomeria.com', 4.9, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Plomería', 'Gasista matriculado. Trabajos con garantía escrita.');
