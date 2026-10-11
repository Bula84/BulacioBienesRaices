-- =====================================================
-- MIGRACIÓN: permisos de escritura sobre `servicios`
-- =====================================================
-- PROBLEMA
--   La política anterior sólo permitía escribir a usuarios con
--   rol `superadmin`:
--
--     CREATE POLICY "SuperAdmins full access on servicios" ...
--       FOR ALL USING (public.get_my_role() = 'superadmin');
--
--   El panel /admin/servicios lo usan los administradores, así
--   que todo INSERT / UPDATE / DELETE era rechazado por RLS.
--   El frontend además cerraba el formulario igualmente, por lo
--   que parecía que se guardaba pero no se guardaba nada.
--
-- SOLUCIÓN
--   Ampliar la política a `admin` + `superadmin`, consistente con
--   site_config, contact_messages, propiedades, emprendimientos
--   y oportunidades.
--
-- CÓMO EJECUTARLO
--   1. Andá a Supabase > SQL Editor.
--   2. Copiá todo este archivo y pegalo en una nueva query.
--   3. Dale a "Run".
--   4. Recargá /admin/servicios y volvé a intentar guardar.
-- =====================================================

-- 1) Eliminar la política vieja (si existe)
DROP POLICY IF EXISTS "SuperAdmins full access on servicios" ON servicios;

-- 2) Eliminar la nueva (para poder re-ejecutar este archivo sin error)
DROP POLICY IF EXISTS "Admins full access on servicios" ON servicios;

-- 3) Crear la política que usan admin y superadmin
CREATE POLICY "Admins full access on servicios" ON servicios
  FOR ALL
  USING (public.get_my_role() IN ('admin', 'superadmin'))
  WITH CHECK (public.get_my_role() IN ('admin', 'superadmin'));

-- =====================================================
-- VERIFICACIÓN 1: quién es quién
-- IMPORTANTE: NO uses `SELECT public.get_my_role()` acá.
-- El SQL Editor corre como service_role, sin auth.uid(), así
-- que siempre devolvería NULL y te haría creer que algo falló.
-- Mirá la tabla directamente:
-- =====================================================
SELECT u.email, r.role, r.created_at AS rol_desde
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
ORDER BY r.role NULLS LAST, u.email;

-- Esperás ver tu propio email con rol 'admin' o 'superadmin'.
-- Si aparece 'pending', necesitás que un superadmin te apruebe
-- desde /admin/usuarios (o cambia el rol a mano con el UPDATE de abajo).

-- =====================================================
-- VERIFICACIÓN 2: la política quedó bien creada
-- Debería devolver UNA sola fila con cmd = ALL y
-- roles = {admin, superadmin}. Si devolvé cero filas,
-- volve a correr el CREATE POLICY de arriba.
-- =====================================================
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'servicios';

-- =====================================================
-- OPCIONAL: si tu rol es 'pending' y ya querés darle
-- permisos, promové tu usuario. Cambiá el email.
-- =====================================================
-- UPDATE public.user_roles SET role = 'admin'
-- WHERE email = 'TU_EMAIL@example.com';
