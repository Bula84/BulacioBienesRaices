-- =====================================================
-- ANTIGRAVITY ENTERPRISE - DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Enable Row Level Security (recommended for production)
-- You may want to add policies based on your auth requirements

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
  images TEXT[], -- Array of additional image URLs
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on propiedades" ON propiedades
  FOR SELECT USING (true);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access on propiedades" ON propiedades
  FOR ALL USING (true);

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on noticias" ON noticias
  FOR SELECT USING (true);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access on noticias" ON noticias
  FOR ALL USING (true);

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on servicios" ON servicios
  FOR SELECT USING (true);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access on servicios" ON servicios
  FOR ALL USING (true);

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Sample Properties
INSERT INTO propiedades (title, description, price, operation, type, m2, bedrooms, bathrooms, coords_lat, coords_lng, image_url, address, city) VALUES
('Departamento de Lujo en Puerto Madero', 'Espectacular departamento con vista al río en la mejor zona de Puerto Madero. Amenities de primer nivel.', 450000, 'venta', 'Departamento', 120, 3, 2, -34.6118, -58.3625, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Puerto Madero', 'Buenos Aires'),
('Casa Moderna en Nordelta', 'Casa de diseño contemporáneo con amplio jardín y pileta. Barrio cerrado con seguridad 24hs.', 8500, 'alquiler', 'Casa', 250, 4, 3, -34.4097, -58.6517, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Nordelta', 'Tigre'),
('Penthouse con Vista al Río', 'Exclusivo penthouse en torre de categoría. Terraza propia con vista panorámica.', 850000, 'venta', 'Penthouse', 200, 4, 3, -34.6037, -58.3816, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Recoleta', 'Buenos Aires'),
('Loft Industrial en Palermo', 'Loft de diseño en edificio reciclado. Techos altos y excelente iluminación natural.', 280000, 'venta', 'Loft', 85, 1, 1, -34.5831, -58.4319, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Palermo Soho', 'Buenos Aires'),
('Departamento Familiar en Belgrano', 'Amplio departamento ideal para familias. Cerca de colegios y transporte.', 4200, 'alquiler', 'Departamento', 150, 3, 2, -34.5619, -58.4567, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Belgrano R', 'Buenos Aires'),
('Casa con Jardín en San Isidro', 'Hermosa casa con amplio jardín en zona residencial. Excelente estado.', 620000, 'venta', 'Casa', 320, 5, 4, -34.4706, -58.5278, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'San Isidro', 'Buenos Aires');

-- Sample News
INSERT INTO noticias (title, content, excerpt, image_url, author) VALUES
('El mercado inmobiliario argentino muestra signos de recuperación', 'El mercado inmobiliario argentino está experimentando una notable recuperación después de varios años de incertidumbre económica...', 'Los expertos señalan un incremento del 15% en las transacciones durante el último trimestre, marcando una tendencia positiva para el sector.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Carlos Rodríguez'),
('Nuevas tendencias en diseño de interiores para 2026', 'Las tendencias de diseño para este año incluyen materiales naturales, colores terrosos y espacios multifuncionales...', 'Descubre las últimas tendencias en decoración y diseño que están transformando los espacios residenciales este año.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', 'María González'),
('Guía completa para invertir en propiedades', 'Invertir en bienes raíces puede ser una excelente forma de generar ingresos pasivos y construir patrimonio a largo plazo...', 'Una guía paso a paso para aquellos que buscan invertir en el mercado inmobiliario por primera vez.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Andrés López');

-- Sample Services
INSERT INTO servicios (name, skill_tags, contact, phone, email, rating, image_url, category, description) VALUES
('Juan Pérez', ARRAY['Instalaciones eléctricas', 'Reparaciones', 'Iluminación LED'], '+54 11 1234-5678', '+541112345678', 'juan.perez@email.com', 4.8, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', 'Electricidad', 'Electricista matriculado con más de 15 años de experiencia en instalaciones residenciales y comerciales.'),
('Roberto Gómez', ARRAY['Plomería general', 'Gas', 'Destapes'], '+54 11 2345-6789', '+541123456789', 'roberto@plomeria.com', 4.9, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Plomería', 'Gasista matriculado. Trabajos de plomería y gas con garantía escrita.'),
('María Fernández', ARRAY['Pintura interior', 'Pintura exterior', 'Empapelado'], '+54 11 3456-7890', '+541134567890', 'maria.pinturas@email.com', 4.7, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', 'Pintura', 'Especialista en pintura decorativa y acabados de alta calidad.'),
('Carlos Mendoza', ARRAY['Muebles a medida', 'Reparaciones', 'Restauración'], '+54 11 4567-8901', '+541145678901', 'carlos.carpintero@email.com', 5.0, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'Carpintería', 'Carpintero artesanal especializado en muebles a medida y restauración de antigüedades.');
