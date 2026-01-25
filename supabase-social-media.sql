-- =====================================================
-- SOCIAL MEDIA PUBLISHING TABLES
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Tabla para configuración de redes sociales
CREATE TABLE IF NOT EXISTS social_media_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok')),
  access_token TEXT,
  refresh_token TEXT,
  page_id TEXT, -- For Facebook Pages
  account_id TEXT, -- For Instagram Business Account
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para publicaciones a redes sociales
CREATE TABLE IF NOT EXISTS publicaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Contenido
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  -- Referencia opcional a propiedad o noticia
  propiedad_id UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  noticia_id UUID REFERENCES noticias(id) ON DELETE SET NULL,
  -- Estado de publicación por plataforma
  facebook_status TEXT DEFAULT 'pending' CHECK (facebook_status IN ('pending', 'published', 'failed', 'skipped')),
  facebook_post_id TEXT,
  facebook_published_at TIMESTAMPTZ,
  facebook_error TEXT,
  instagram_status TEXT DEFAULT 'pending' CHECK (instagram_status IN ('pending', 'published', 'failed', 'skipped')),
  instagram_post_id TEXT,
  instagram_published_at TIMESTAMPTZ,
  instagram_error TEXT,
  tiktok_status TEXT DEFAULT 'pending' CHECK (tiktok_status IN ('pending', 'published', 'failed', 'skipped')),
  tiktok_post_id TEXT,
  tiktok_published_at TIMESTAMPTZ,
  tiktok_error TEXT,
  -- Programación
  scheduled_for TIMESTAMPTZ, -- NULL = publicar inmediatamente
  -- Meta
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_media_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones ENABLE ROW LEVEL SECURITY;

-- Solo SuperAdmins pueden ver/editar config de redes sociales
CREATE POLICY "SuperAdmins manage social config" ON social_media_config
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- Publicaciones: lectura pública para métricas
CREATE POLICY "Public can view published posts" ON publicaciones
  FOR SELECT USING (
    facebook_status = 'published' OR 
    instagram_status = 'published' OR 
    tiktok_status = 'published'
  );

-- Admins pueden crear y ver sus propias publicaciones
CREATE POLICY "Admins can manage own publications" ON publicaciones
  FOR ALL USING (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

-- SuperAdmins pueden todo
CREATE POLICY "SuperAdmins full access on publicaciones" ON publicaciones
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- Index para optimizar queries
CREATE INDEX IF NOT EXISTS idx_publicaciones_scheduled ON publicaciones(scheduled_for) 
  WHERE scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_publicaciones_pending ON publicaciones(created_at) 
  WHERE facebook_status = 'pending' OR instagram_status = 'pending' OR tiktok_status = 'pending';
