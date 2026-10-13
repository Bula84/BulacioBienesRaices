# Bulacio Bienes Raíces

Plataforma inmobiliaria construida con **Next.js 16**, **Supabase** y **Google Gemini**.

> **Estado:** rebuild en curso — ver [`docs/PLAN-REBUILD.md`](docs/PLAN-REBUILD.md) para el plan completo.

---

## ✨ Qué incluye

### Público
| Ruta | Qué hace |
|------|----------|
| `/` | Portada: destacados, fondos de comercio, tasaciones y Gestión Legal |
| `/propiedades` | Buscador con filtros (operación, tipo, precio) |
| `/propiedades/[id]` | Ficha: galería, amenities, mapa, formulario y chat con agente IA |
| `/fondos-de-comercio` | Listado de negocios en venta (`type = fondo_comercio`) |
| `/tasaciones` | Solicitud de tasación → se guarda en la bandeja admin |
| **`/gestion-legal`** | **Cobranza de mora extrajudicial/judicial + asesoramiento jurídico, con asistente IA** |
| `/nosotros` · `/contacto` | Institucional y formulario de contacto |
| `/login` · `/registro` | Autenticación (Supabase Auth) |
| `/legal/terminos` · `/legal/privacidad` · `/legal/cookies` | Páginas legales |

### Panel de administración (`/admin`, protegido por rol + middleware)
| Ruta | Qué hace |
|------|----------|
| `/admin` | Dashboard con datos reales (propiedades, mensajes, casos legales) |
| `/admin/propiedades` | CRUD de propiedades con galería, amenities y destacados |
| `/admin/gestion-legal` | **Bandeja de casos de cobranza con cambio de estado** |
| `/admin/publicaciones` | Publicación a Facebook / Instagram / TikTok |
| `/admin/calculadora` | Ajuste de alquileres con **índices oficiales del BCRA** |
| `/admin/configuracion` | Contacto, bandeja de mensajes y tokens de redes |
| `/admin/usuarios` | Aprobación de usuarios (sólo superadmin) |
| `/admin/servicios` | CRUD del directorio de profesionales — *módulo dormido* |

### Módulo dormido: `/servicios`
El directorio de profesionales **se conserva íntegro** (rutas, CRUD y tabla) para una futura
implementación, pero está **fuera de la navegación pública** y con `noindex`.

**Para reactivarlo:**
1. Volver a agregar los links en `src/components/Navbar.tsx` y `src/components/Footer.tsx`
2. Cambiar `robots.index` a `true` en `src/app/servicios/layout.tsx`

---

## 🛠️ Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Lenguaje**: TypeScript 5 · React 19
- **Estilos**: Tailwind CSS 4
- **Estado**: Zustand
- **Base de datos**: Supabase (Postgres + RLS + Storage + Edge Functions)
- **IA**: Google Gemini (chat de propiedades y asistente de Gestión Legal)
- **Mapas**: Mapbox GL
- **Iconos**: Lucide React

---

## 🚀 Puesta en marcha

```bash
npm install
cp .env.local.example .env.local   # completar credenciales
npm run dev
```

Variables de entorno (hay una plantilla en [`.env.local.example`](.env.local.example)):

```env
NEXT_PUBLIC_SUPABASE_URL=        # Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase → Settings → API (anon public)
NEXT_PUBLIC_MAPBOX_TOKEN=        # account.mapbox.com/access-tokens
NEXT_PUBLIC_SITE_URL=            # dominio canónico (no usar la URL del deploy puntual)
```

> Todas las `NEXT_PUBLIC_*` se incrustan en el bundle **al momento de compilar**.
> Cambiarlas después exige un rebuild / redeploy, no alcanza con guardarlas.

### Base de datos

1. Crear un proyecto en [Supabase](https://supabase.com)
2. SQL Editor → pegar **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecutarlo
3. Registrarse en `/registro`. El usuario queda con rol `pending` y todavía no puede entrar al panel
4. Volver al SQL Editor y otorgarle superadmin (**reemplazar el email por el propio**):

   ```sql
   UPDATE public.user_roles
   SET role = 'superadmin', updated_at = NOW()
   WHERE email = 'tu-email@dominio.com'
   RETURNING email, role;
   ```

> El `schema.sql` incluye un `INSERT` de superadmin al final, pero **no asigna nada**:
> se ejecuta antes de que exista ningún usuario en `auth.users`. Por eso el paso 4
> es obligatorio y va *después* del registro.

El schema crea 9 tablas: `user_roles`, `propiedades`, `servicios` *(dormido)*,
`chat_conversations`, `legal_cases`, `site_config`, `contact_messages`,
`social_media_config` y `publicaciones`. Además crea el bucket de storage `media`.

### Edge Functions

```bash
npx supabase functions deploy property-agent
npx supabase functions deploy gestion-legal
npx supabase functions deploy publish-social-media

npx supabase secrets set GEMINI_API_KEY=...      # chat IA (property-agent + gestion-legal)
npx supabase secrets set RESEND_API_KEY=...      # notificación al asesor
npx supabase secrets set LEGAL_NOTIFY_TO=asesor@...
npx supabase secrets set LEGAL_NOTIFY_FROM=...   # opcional, por defecto onboarding@resend.dev
```

> `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` se inyectan solos; no hace falta setearlos.

---

## 🚀 Despliegue (Vercel)

El proyecto está conectado a Vercel desde GitHub. Vercel mapea ramas a entornos **automáticamente**:

| Rama | Entorno | Resultado |
|------|---------|-----------|
| `master` | **Production** | el sitio real |
| cualquier otra (`develop`, `feature/*`) | **Preview** | URL temporal para revisar |

Flujo de trabajo:

```bash
git checkout develop
# ... cambios ...
git push origin develop          # Vercel genera un Preview

# probar el Preview, y si está bien:
#   GitHub → Pull Request → develop → master → Merge
# Vercel despliega a Production
```

> ⚠️ Las variables `NEXT_PUBLIC_*` se configuran **por entorno** en
> *Vercel → Settings → Environment Variables*. Cargá cada una para
> **Production, Preview y Development**; si solo están en Production,
> el Preview despliega sin ellas y la app falla al conectar con Supabase.

> 💡 Conviene proteger `master` en *GitHub → Settings → Branches* exigiendo
> Pull Request antes de merge, para que nada llegue a producción sin revisar.

---

## 📁 Estructura

```
supabase/
├── schema.sql                    # schema completo (ejecutar en el SQL Editor)
└── functions/
    ├── property-agent/           # chat IA del detalle de propiedad (Gemini)
    ├── gestion-legal/            # asistente legal + derivación + email
    └── publish-social-media/     # publicación a FB / IG / TikTok

src/
├── app/
│   ├── api/indices/route.ts      # ICL (BCRA v4.0) + IPC (datos.gob.ar), cacheado 6h
│   ├── gestion-legal/            # landing de cobranza de mora
│   ├── admin/gestion-legal/      # bandeja de casos
│   └── servicios/                # MÓDULO DORMIDO
├── components/
│   ├── LegalAssistant.tsx        # chat del asistente legal
│   └── PropertyChat.tsx          # chat del agente inmobiliario
├── context/AuthContext.tsx       # sesión + roles + cookie para el middleware
├── lib/supabase.ts               # capa de datos (todo el acceso a DB)
└── proxy.ts                      # middleware: headers + guardia de /admin
```

---

## 🧪 Calidad

```bash
npm run lint      # ESLint — 0 errores, 0 warnings
npx tsc --noEmit  # TypeScript — 0 errores
npm run build     # Build de producción
```

> `npm run lint` y `npx tsc` cubren el código de Next.js. Las Edge Functions de
> `supabase/functions/` corren en **Deno**, quedan fuera del build y por eso están
> excluidas del lint (ver `eslint.config.mjs`).

---

## 🔒 Seguridad

- **Row Level Security** en las 9 tablas — es la barrera real
- `src/proxy.ts` redirige `/admin` a `/login` si no hay cookie de sesión (primer filtro)
- El panel además valida rol `admin`/`superadmin` en `src/app/admin/layout.tsx`
- Headers de seguridad en toda respuesta (`X-Frame-Options`, `nosniff`, etc.)

> La protección de `/admin` depende de RLS, no del middleware. Cualquier consulta
> que un rol no autorizado no debería hacer está bloqueada en la base de datos.
