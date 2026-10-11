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

Variables de entorno:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

### Base de datos

1. Crear un proyecto en [Supabase](https://supabase.com)
2. SQL Editor → pegar **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql)
3. Registrarse en `/registro` (el script ya deja a `gerbula84@gmail.com` como superadmin)

El schema crea 10 tablas: `user_roles`, `propiedades`, `servicios` *(dormido)*,
`chat_conversations`, `legal_cases`, `site_config`, `contact_messages`,
`social_media_config`, `publicaciones` y el bucket `media`.

### Edge Functions

```bash
npx supabase functions deploy property-agent
npx supabase functions deploy gestion-legal

npx supabase secrets set GEMINI_API_KEY=...
npx supabase secrets set RESEND_API_KEY=...      # notificación al asesor
npx supabase secrets set LEGAL_NOTIFY_TO=asesor@...
```

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
npm run lint    # ESLint — 0 errores, 0 warnings
npx tsc --noEmit  # TypeScript — 0 errores
npm run build   # Build de producción
```

---

## 🔒 Seguridad

- **Row Level Security** en las 10 tablas — es la barrera real
- `src/proxy.ts` redirige `/admin` a `/login` si no hay cookie de sesión (primer filtro)
- El panel además valida rol `admin`/`superadmin` en `src/app/admin/layout.tsx`
- Headers de seguridad en toda respuesta (`X-Frame-Options`, `nosniff`, etc.)

> La protección de `/admin` depende de RLS, no del middleware. Cualquier consulta
> que un rol no autorizado no debería hacer está bloqueada en la base de datos.
