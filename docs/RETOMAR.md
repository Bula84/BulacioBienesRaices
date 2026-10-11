# RETOMAR — contexto mínimo

**Proyecto:** `C:\Users\germa\Bulaciobienesraices` · Next.js 16 + Supabase
**Detalle completo (sólo si hace falta):** `docs/PLAN-REBUILD.md`

---

## Estado

| | |
|---|---|
| Build | ✅ `tsc` 0 errores · `eslint` 0 warnings · `npm run build` 25 rutas |
| Base de datos | ✅ Supabase ref **`nxxgrpifmfsyrqkytioi`** (doble `x`) · `supabase/schema.sql` aplicado (9 tablas) · `.env.local` ok |
| Panel admin | ✅ `/admin` accesible · superadmin `gerbula84@gmail.com` |
| Commits | ⚠️ **Ninguno** — todo en working tree |

---

## Siguiente paso: tests de funcionamiento

En `localhost:3000` (npm run dev):

1. `/admin/propiedades` → crear propiedad marcada **"Destacada"** → ¿guarda?
   *(antes fallaba: faltaban columnas `is_featured` y `video_url`)*
2. Subir foto → ¿entra al bucket `media`?
3. Portada → ¿aparece en "Destacadas"? ¿se va el cartel 🚧 de ejemplo?
4. `/tasaciones` → enviar → ¿aparece en `/admin/configuracion`?
5. `/gestion-legal` → enviar caso → ¿aparece en `/admin/gestion-legal`?
6. Detalle de propiedad → formulario → ¿persiste?
7. `/admin/calculadora` → ¿trae índices BCRA reales?
8. `/admin/usuarios`, `/admin/publicaciones`, `/admin/configuracion`

---

## Bloqueado en el usuario

- **Clave Gemini** + `npx supabase functions deploy property-agent gestion-legal` → los 2 chatbots
- **Token Mapbox** en `.env.local` → mapa del detalle
- Cuenta **Vercel** + dominio → producción

---

## Reglas clave (no romper)

- **`/servicios` está dormido a propósito**: fuera del menú y con `noindex`.
  No borrar — se reactiva poniendo los links en `Navbar.tsx`/`Footer.tsx` y `robots.index: true` en `src/app/servicios/layout.tsx`.
- Usar la **anon key (JWT)** de Supabase. La *publishable* da `401 Invalid API key`.
- Orden del schema: **tablas → funciones → policies** (`get_my_role()` usa `LANGUAGE sql`, se valida al crearla).
- Los módulos **emprendimientos / oportunidades / noticias** fueron eliminados deliberadamente.

---

## Comandos

```bash
npm run dev          # localhost:3000
npx tsc --noEmit     # chequeo tipos
npx eslint src       # chequeo lint
npm run build        # build producción
```
