-- =====================================================
-- BULACIO BIENES RAÍCES — SCHEMA COMPLETO v2
-- -----------------------------------------------------
-- Ejecutar TODO este archivo en el SQL Editor de Supabase,
-- en una sola corrida.
--
-- Cambios respecto al schema v1 (ver docs/PLAN-REBUILD.md):
--   * Orden corregido: tablas → funciones → policies.
--     get_my_role() usa LANGUAGE sql (se valida al crearla), así que
--     tiene que ir DESPUÉS de user_roles y ANTES de cualquier
--     CREATE POLICY. El v1 la ponía después de las policies (error
--     42883) y ésta versión la puso antes de la tabla (error 42P01).
--   * propiedades ahora SÍ tiene is_featured y video_url
--     (el admin fallaba al guardar y la home no mostraba destacados).
--   * chat_conversations creada (el chat IA la usaba sin existir).
--   * social_media_config con UNA sola definición compatible con
--     el frontend (facebook/instagram/tiktok + UNIQUE(platform)).
--   * Bucket de storage `media` creado (subir fotos fallaba antes).
--   * Nueva tabla legal_cases para Gestión Legal.
--   * Eliminadas: noticias, emprendimientos, oportunidades.
--   * Servicios SE CONSERVA (módulo dormido, ver F1 del plan).
-- =====================================================

-- =====================================================
-- 0. FUNCIONES BASE (sin dependencias de tablas todavía)
-- =====================================================

-- Trigger helper: mantiene updated_at al día
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 1. USER ROLES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pending' CHECK (role IN ('pending', 'admin', 'superadmin')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 1b. FUNCIONES QUE DEPENDEN DE user_roles
--      Van DESPUÉS de la tabla y ANTES de cualquier
--      CREATE POLICY (el lenguaje sql valida las tablas
--      al momento de crear la función).
-- =====================================================

-- Devuelve el rol del usuario autenticado.
-- SECURITY DEFINER para evitar recursión en las políticas RLS.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Crea el rol 'pending' automáticamente al registrarse un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'pending')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER set_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create pending role" ON public.user_roles;
CREATE POLICY "Users can create pending role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'pending');

DROP POLICY IF EXISTS "SuperAdmins can view all roles" ON public.user_roles;
CREATE POLICY "SuperAdmins can view all roles" ON public.user_roles
  FOR SELECT USING (public.get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "SuperAdmins can manage roles" ON public.user_roles;
CREATE POLICY "SuperAdmins can manage roles" ON public.user_roles
  FOR ALL USING (public.get_my_role() = 'superadmin');


-- =====================================================
-- 2. PROPIEDADES (incluye fondos de comercio por `type`)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.propiedades (
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
  video_url TEXT,              -- NUEVO: el admin lo enviaba y la columna no existía
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
  -- Contacto
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  -- Agente IA
  expensas NUMERIC,
  requisitos TEXT,
  calendar_id TEXT,
  agent_enabled BOOLEAN DEFAULT FALSE,
  -- Destacadas (NUEVO: la home filtraba por esta columna inexistente)
  is_featured BOOLEAN DEFAULT FALSE,
  -- Meta
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.propiedades ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_propiedades_updated_at ON public.propiedades;
CREATE TRIGGER set_propiedades_updated_at
  BEFORE UPDATE ON public.propiedades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP INDEX IF EXISTS idx_propiedades_featured;
CREATE INDEX idx_propiedades_featured ON public.propiedades (is_featured) WHERE is_featured = TRUE;
DROP INDEX IF EXISTS idx_propiedades_type;
CREATE INDEX idx_propiedades_type ON public.propiedades (type);
DROP INDEX IF EXISTS idx_propiedades_operation;
CREATE INDEX idx_propiedades_operation ON public.propiedades (operation);

DROP POLICY IF EXISTS "Allow public read access on propiedades" ON public.propiedades;
CREATE POLICY "Allow public read access on propiedades" ON public.propiedades
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "SuperAdmins full access on propiedades" ON public.propiedades;
CREATE POLICY "SuperAdmins full access on propiedades" ON public.propiedades
  FOR ALL USING (public.get_my_role() = 'superadmin');

DROP POLICY IF EXISTS "Admins can insert own propiedades" ON public.propiedades;
CREATE POLICY "Admins can insert own propiedades" ON public.propiedades
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

DROP POLICY IF EXISTS "Admins can update own propiedades" ON public.propiedades;
CREATE POLICY "Admins can update own propiedades" ON public.propiedades
  FOR UPDATE USING (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );

DROP POLICY IF EXISTS "Admins can delete own propiedades" ON public.propiedades;
CREATE POLICY "Admins can delete own propiedades" ON public.propiedades
  FOR DELETE USING (
    auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin')
  );


-- =====================================================
-- 3. SERVICIOS — MÓDULO DORMIDO (se conserva para futuro)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  skill_tags TEXT[],
  contact TEXT,
  phone TEXT,
  email TEXT,
  rating NUMERIC DEFAULT 5 CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  images TEXT[],
  video_url TEXT,
  category TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  budget_info TEXT,
  techniques TEXT[],
  certifications TEXT[],
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_servicios_updated_at ON public.servicios;
CREATE TRIGGER set_servicios_updated_at
  BEFORE UPDATE ON public.servicios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Allow public read access on servicios" ON public.servicios;
CREATE POLICY "Allow public read access on servicios" ON public.servicios
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on servicios" ON public.servicios;
CREATE POLICY "Admins full access on servicios" ON public.servicios
  FOR ALL
  USING (public.get_my_role() IN ('admin', 'superadmin'))
  WITH CHECK (public.get_my_role() IN ('admin', 'superadmin'));


-- =====================================================
-- 4. CHAT_CONVERSATIONS (agente IA de propiedades)
--     Antes NO existía en ningún SQL y el chat fallaba en silencio.
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.propiedades(id) ON DELETE CASCADE,
  visitor_name TEXT,
  visitor_phone TEXT,
  visitor_email TEXT,
  is_qualified BOOLEAN DEFAULT FALSE,
  visit_scheduled BOOLEAN DEFAULT FALSE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER set_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP INDEX IF EXISTS idx_chat_conversations_property;
CREATE INDEX idx_chat_conversations_property ON public.chat_conversations (property_id);

-- Cualquiera puede iniciar una conversación (visitante anónimo)
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can create conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (true);

-- Un visitante puede actualizar su propia conversación (si no está logueado, es nulo = anónimo)
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can update conversations" ON public.chat_conversations
  FOR UPDATE USING (true) WITH CHECK (true);

-- Sólo admins leen las conversaciones
DROP POLICY IF EXISTS "Admins can read conversations" ON public.chat_conversations;
CREATE POLICY "Admins can read conversations" ON public.chat_conversations
  FOR SELECT USING (public.get_my_role() IN ('admin', 'superadmin'));


-- =====================================================
-- 5. LEGAL CASES — GESTIÓN LEGAL (captación de mora)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.legal_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Quién consulta
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_role TEXT CHECK (contact_role IN ('propietario', 'inmobiliaria', 'administracion', 'otro')),
  -- Datos del caso
  debtor_name TEXT,
  contract_type TEXT CHECK (contract_type IN ('alquiler', 'expensas', 'servicios', 'fondo_comercio', 'otro')),
  amount NUMERIC,
  days_overdue INTEGER,
  stage TEXT NOT NULL DEFAULT 'sin_determinar' CHECK (stage IN ('extrajudicial', 'judicial', 'sin_determinar')),
  -- Relato
  details TEXT,
  -- Resumen armado por el asistente IA
  ai_summary TEXT,
  -- Gestión interna
  status TEXT NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_revision', 'contactado', 'cerrado')),
  is_read BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_legal_cases_updated_at ON public.legal_cases;
CREATE TRIGGER set_legal_cases_updated_at
  BEFORE UPDATE ON public.legal_cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP INDEX IF EXISTS idx_legal_cases_status;
CREATE INDEX idx_legal_cases_status ON public.legal_cases (status, created_at DESC);

-- Cualquiera puede enviar un caso (formulario público)
DROP POLICY IF EXISTS "Anyone can submit legal case" ON public.legal_cases;
CREATE POLICY "Anyone can submit legal case" ON public.legal_cases
  FOR INSERT WITH CHECK (true);

-- Sólo el equipo gestiona los casos
DROP POLICY IF EXISTS "Admins can manage legal_cases" ON public.legal_cases;
CREATE POLICY "Admins can manage legal_cases" ON public.legal_cases
  FOR ALL USING (public.get_my_role() IN ('admin', 'superadmin'))
  WITH CHECK (public.get_my_role() IN ('admin', 'superadmin'));


-- =====================================================
-- 6. SITE CONFIG + CONTACT MESSAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_config" ON public.site_config;
CREATE POLICY "Public can read site_config" ON public.site_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site_config" ON public.site_config;
CREATE POLICY "Admins can manage site_config" ON public.site_config
  FOR ALL USING (public.get_my_role() IN ('admin', 'superadmin'));

INSERT INTO public.site_config (key, value) VALUES (
  'contact_info',
  '{"phone": "+54 11 1234-5678", "email": "contacto@bcbienesraices.com", "whatsapp": "+5411123456789", "address": "Buenos Aires, Argentina", "business_hours": "Lunes a Viernes 9:00 - 18:00"}'::jsonb
) ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contacto',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contact_messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact_messages" ON public.contact_messages
  FOR ALL USING (public.get_my_role() IN ('admin', 'superadmin'));

DROP INDEX IF EXISTS idx_contact_messages_unread;
CREATE INDEX idx_contact_messages_unread ON public.contact_messages (is_read, created_at DESC);


-- =====================================================
-- 7. REDES SOCIALES — definición única y compatible
--     (el schema v1 tenía DOS definiciones incompatibles)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.social_media_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('facebook', 'instagram', 'tiktok')),
  access_token TEXT,
  refresh_token TEXT,
  page_id TEXT,
  account_id TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_media_config ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_social_media_config_updated_at ON public.social_media_config;
CREATE TRIGGER set_social_media_config_updated_at
  BEFORE UPDATE ON public.social_media_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "SuperAdmins manage social config" ON public.social_media_config;
CREATE POLICY "SuperAdmins manage social config" ON public.social_media_config
  FOR ALL USING (public.get_my_role() = 'superadmin');

-- Lectura para admins (la pestaña de configuración la muestra a ambos roles)
DROP POLICY IF EXISTS "Admins can read social config" ON public.social_media_config;
CREATE POLICY "Admins can read social config" ON public.social_media_config
  FOR SELECT USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE TABLE IF NOT EXISTS public.publicaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  propiedad_id UUID REFERENCES public.propiedades(id) ON DELETE SET NULL,
  -- Facebook
  facebook_status TEXT DEFAULT 'pending' CHECK (facebook_status IN ('pending', 'published', 'failed', 'skipped')),
  facebook_post_id TEXT,
  facebook_published_at TIMESTAMPTZ,
  facebook_error TEXT,
  -- Instagram
  instagram_status TEXT DEFAULT 'pending' CHECK (instagram_status IN ('pending', 'published', 'failed', 'skipped')),
  instagram_post_id TEXT,
  instagram_published_at TIMESTAMPTZ,
  instagram_error TEXT,
  -- TikTok
  tiktok_status TEXT DEFAULT 'pending' CHECK (tiktok_status IN ('pending', 'published', 'failed', 'skipped')),
  tiktok_post_id TEXT,
  tiktok_published_at TIMESTAMPTZ,
  tiktok_error TEXT,
  -- Programación
  scheduled_for TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.publicaciones ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_publicaciones_updated_at ON public.publicaciones;
CREATE TRIGGER set_publicaciones_updated_at
  BEFORE UPDATE ON public.publicaciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP INDEX IF EXISTS idx_publicaciones_scheduled;
CREATE INDEX idx_publicaciones_scheduled ON public.publicaciones (scheduled_for)
  WHERE scheduled_for IS NOT NULL;

DROP INDEX IF EXISTS idx_publicaciones_pendientes;
CREATE INDEX idx_publicaciones_pendientes ON public.publicaciones (created_at DESC)
  WHERE facebook_status = 'pending'
     OR instagram_status = 'pending'
     OR tiktok_status = 'pending';

DROP POLICY IF EXISTS "Public can view published posts" ON public.publicaciones;
CREATE POLICY "Public can view published posts" ON public.publicaciones
  FOR SELECT USING (
    facebook_status = 'published'
    OR instagram_status = 'published'
    OR tiktok_status = 'published'
  );

DROP POLICY IF EXISTS "Admins can manage own publications" ON public.publicaciones;
CREATE POLICY "Admins can manage own publications" ON public.publicaciones
  FOR ALL
  USING (auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin'))
  WITH CHECK (auth.uid() = user_id AND public.get_my_role() IN ('admin', 'superadmin'));

DROP POLICY IF EXISTS "SuperAdmins full access on publicaciones" ON public.publicaciones;
CREATE POLICY "SuperAdmins full access on publicaciones" ON public.publicaciones
  FOR ALL USING (public.get_my_role() = 'superadmin');


-- =====================================================
-- 8. STORAGE — bucket `media`
--     Antes no se creaba en ningún lado: subir fotos fallaba.
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated can upload media" ON storage.objects;
CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update media" ON storage.objects;
CREATE POLICY "Authenticated can update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete media" ON storage.objects;
CREATE POLICY "Authenticated can delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');


-- =====================================================
-- 9. SUPERADMIN — reemplazá el email por el tuyo si hace falta
-- =====================================================
INSERT INTO public.user_roles (user_id, email, role)
SELECT id, email, 'superadmin'
FROM auth.users
WHERE email = 'gerbula84@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin', updated_at = NOW();


-- =====================================================
-- 10. VERIFICACIÓN RÁPIDA
--     Al final del script deberías ver 9 tablas listadas.
-- =====================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
