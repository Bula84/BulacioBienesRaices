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
-- VERIFICACIÓN
-- Debería devolver UNA sola fila con cmd = ALL y
-- roles = {admin, superadmin}.
-- =====================================================
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'servicios';

-- =====================================================
-- OPCIONAL: comprobar tu propio rol
-- Debería devolver 'admin' o 'superadmin'.
-- =====================================================
SELECT public.get_my_role() AS mi_rol;
