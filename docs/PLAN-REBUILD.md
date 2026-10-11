# PLAN DE REBUILD — Bulacio Bienes Raíces

**Versión:** 1.0 · **Fecha:** 11/10/2026 · **Estado:** ✅ Ejecutado — pendiente de Fase 0 (usuario) y testing final
**Repo:** `github.com/GerBula/BulacioBienesRaices`
**Alcance:** Actualización con cambios estéticos y funcionales — recorte de módulos, reparación de bugs, módulo nuevo de Gestión Legal y puesta en producción.

---

## ✅ ESTADO DE EJECUCIÓN (11/10/2026)

| Fase | Estado | Notas |
|------|--------|-------|
| **F0 · Cimientos** | ✅ **Completada (11/10)** | Proyecto Supabase `nxxgrpifmfsyrqkytioi` creado · `schema.sql` aplicado (9 tablas) · `.env.local` apuntando a la DB nueva · RLS verificada |
| **F1 · Recorte** | ✅ Completada | 0 referencias a módulos eliminados. `/oportunidades` y `/emprendimientos` devuelven 404 |
| **F2 · Reparación** | ✅ Completada | Bugs B7–B16 resueltos, código muerto limpio, naming unificado |
| **F3 · Gestión Legal** | ✅ Completada | Landing + asistente + `/admin/gestion-legal` + Edge Function |
| **F4 · IA del agente** | 🟡 **Código listo, sin desplegar** | Falta `GEMINI_API_KEY` + `supabase functions deploy` |
| **F5 · Calculadora BCRA** | ✅ **Verificada con datos reales** | ICL 36,77 (BCRA v4.0, serie 40) · IPC 12.276,77 (datos.gob.ar). Caché 6 h |
| **F6 · Redes** | ✅ Completada | Compartir con UTM · GA4 + Meta Pixel configurables desde el admin · plantilla de post con link UTM |
| **F7 · Rediseño** | 🟢 **Parcial** | Buscador-heroe ✅ · filtros por querystring ✅ (antes no funcionaban) · placeholders marcados ✅ · falta reorganizar el resto de la home |
| **F8 · Legal + Producción** | 🟢 **Parcial** | `/legal/terminos` y `/legal/cookies` creadas y linkeadas ✅ · README reescrito ✅ · falta dominio |

---

## 📍 DÓNDE QUEDAMOS — SESIÓN DEL 11/10/2026

### Lo último que se hizo
1. **Proyecto Supabase nuevo** — ref `nxxgrpifmfsyrqkytioi` (ojo: doble `x`)
2. **`supabase/schema.sql` aplicado** — corregí un bug de orden propio: `get_my_role()` usa
   `LANGUAGE sql` y se valida al crearla, así que va **después** de `user_roles` y **antes**
   de las `CREATE POLICY`. El orden final del script es: tablas → funciones → policies.
3. **`.env.local`** apunta a la DB nueva con la **anon key (JWT)**.
   *La publishable key que se recibió da `401 Invalid API key` — no usarla.*
4. **Usuario registrado y promovido a superadmin** — el panel `/admin` ya es accesible.

### Verificado en vivo
| Prueba | Resultado |
|---|---|
| 9 tablas existen y responden | ✅ |
| INSERT anónimo en `contact_messages` → 201 | ✅ |
| INSERT anónimo en `propiedades` → 401 (RLS bloquea) | ✅ |
| 12 rutas públicas → 200 | ✅ |
| `/admin` sin sesión → 307 redirect | ✅ |
| `/api/indices` → ICL + IPC reales | ✅ |

### ⏳ TESTS PENDIENTES (retomar acá)
| # | Test | Qué valida | Estado |
|---|---|---|---|
| 1 | Crear propiedad con **"Destacada"** marcada | Columnas `is_featured` / `video_url` (bug B1) | ⬜ |
| 2 | Subir foto desde el formulario | Bucket `media` (bug B4) | ⬜ |
| 3 | Verificar la propiedad en la portada | `getPropiedades({isFeatured:true})` | ⬜ |
| 4 | Enviar solicitud en `/tasaciones` | Debe persistir en `contact_messages` (bug B8) | ⬜ |
| 5 | Caso en `/gestion-legal` | Debe aparecer en `/admin/gestion-legal` | ⬜ |
| 6 | Formulario del detalle de propiedad | Debe persistir (bug B9) | ⬜ |
| 7 | Calculadora con índices reales | API BCRA | ⬜ |
| 8 | Usuarios / Publicaciones / Configuración | CRUDs admin | ⬜ |

### 🚧 Pendientes (bloqueados en vos)
| Item | Desbloquea |
|---|---|
| **Clave de Gemini** (aistudio.google.com) | F4 chat + asistente legal |
| `npx supabase functions deploy property-agent gestion-legal` + secrets | Los dos chatbots |
| Token de **Mapbox** | Mapa del detalle de propiedad |
| **Vercel** + import del repo | Deploy |
| Dominio `bulaciobienesraices.com` | F8 |

### ℹ️ Datos de la sesión
- **Proyecto Supabase:** `https://nxxgrpifmfsyrqkytioi.supabase.co`
- **Dev server:** `npm run dev` → `http://localhost:3000`
- **Superadmin:** `gerbula84@gmail.com`
- Quedó 1 fila de prueba en `contact_messages` (borrarla desde `/admin/configuracion`)

---

### Verificaciones pasadas

```
npx tsc --noEmit  → 0 errores
npx eslint src    → 0 errores, 0 warnings
npm run build     → ✅ 25 rutas compiladas
```

| Prueba | Resultado |
|--------|-----------|
| 13 rutas públicas responden 200 sin errores de runtime | ✅ |
| `/oportunidades`, `/emprendimientos` → 404 | ✅ |
| `/servicios` tiene `noindex` | ✅ |
| `/gestion-legal` es indexable | ✅ |
| `/api/indices` devuelve ICL + IPC oficiales | ✅ |
| Links del Footer con querystring ahora filtran | ✅ (antes no hacían nada) |

---

## 0. PROCESO ACORDADO

| Etapa | Responsable | Estado |
|---|---|---|
| 1. Análisis del proyecto | Agente | ✅ Completado |
| 2. Planificación + este documento | Agente | ✅ Completado |
| 3. **Build** — ejecución de los cambios | Agente | ⏳ Pendiente (cambio de modo) |
| 4. **Testing de funcionamiento** | Agente + Usuario | ⏳ Pendiente |

---

## 1. REGISTRO DE DECISIONES

| # | Pregunta | Decisión |
|---|---|---|
| D1 | ¿Gestión Legal es marca separada? | **No.** Parte de la firma, con sub-marca y acento de color propio, enfoque de captación por morosidad |
| D2 | ¿Hay fotos/propiedades reales? | **No todavía.** Se diseña con placeholders visibles, no stock de Unsplash |
| D3 | ¿Dónde se deploya? | **Vercel** (repo ya en GitHub) |
| D4 | ¿Dominio? | **`bulaciobienesraices.com` — libre (verificado 11/10/2026)**. Comprar en Vercel. `.com.ar` recién en F8 |
| D5 | ¿`/servicios` se elimina? | **No — queda dormido** (ver §3.4) |
| D6 | ¿Se quedan fondos-de-comercio y registro? | **Sí, se quedan** |
| D7 | ¿Qué pasa con noticias/blog? | **Se elimina** (tabla + 6 helpers muertos, nunca tuvo páginas) |
| D8 | ¿Chat IA del agente inmobiliario? | **Reconstruirlo completo** |
| D9 | ¿Calculadora? | **Conectar a API real del BCRA** |
| D10 | ¿Publicaciones a redes? | **Se mantienen** + paquete de publicidad |
| D11 | ¿Proveedor de IA? | **Google Gemini** (tier gratuito) |
| D12 | ¿Alcance de "publicidad en redes"? | **Paquete "Redes que rinden"** — formato + compartir + pixel/analítica (ver §5) |
| D13 | ¿Cómo conecta el asistente legal con el asesor? | **Deriva a bandeja + notificación instantánea** (Resend) |
| D14 | ¿Estética sin fotos? | **Estructura lista + placeholders visibles** |
| D15 | ¿Identidad de Gestión Legal? | **Sub-marca con acento de color propio** |
| D16 | ¿Borrar proyecto Supabase? | **Sí — proyecto nuevo** (6 defectos estructurales verificados) |

---

## 2. DIAGNÓSTICO — LO QUE ESTÁ ROTO

### 🔴 Nivel 1 — La base de datos no soporta el código (bloqueante)

| # | Defecto | Evidencia |
|---|---|---|
| B1 | `propiedades` **no tiene `is_featured` ni `video_url`** → guardar una propiedad falla y la home no muestra destacados | En el SQL esas columnas sólo existen en `oportunidades` (L350) y `servicios` (L124) |
| B2 | `chat_conversations` **no existe en ningún SQL** → el chat IA falla y traga el error | — |
| B3 | Edge Function **`property-agent` se invoca pero no existe** en el repo | `supabase.ts` L1266 |
| B4 | **Bucket `media` no se crea en ningún lado** → subir fotos falla con "Bucket not found" | sin `CREATE BUCKET` en el repo |
| B5 | **`supabase-schema.sql` fallaría al ejecutarse de corrido** — policy de `social_media_config` (L162) usa `get_my_role()` que se define recién en L184 → error 42883 + rollback total | — |
| B6 | **`social_media_config` definida 2 veces e incompatible** (schema L145 vs social-media L7) → el `upsert onConflict:'platform'` falla si ganó la v1 | — |

### 🟠 Nivel 2 — Bugs de frontend

| # | Bug | Ubicación |
|---|---|---|
| B7 | **Doble `<Navbar />`** en detalle de propiedad y de servicio | `propiedades/[id]` L284 · `servicios/[id]` L105 |
| B8 | **`/tasaciones` no envía nada** (`console.log` + `alert`) | `tasaciones/page.tsx` L21-22 |
| B9 | **Formulario de contacto del detalle no persiste** | `propiedades/[id]` L207 |
| B10 | **Login redirige a `/`** en vez de `/admin` | `login/page.tsx` L37 |
| B11 | **Dashboard admin 100% mock** + dice "Antigravity Enterprise" | `admin/page.tsx` L15-78 |
| B12 | **Calculadora con índices ficticios** (sin API) | `admin/calculadora/page.tsx` L7-28 |
| B13 | **Links rotos**: `/legal/terminos`, `/legal/cookies` | `Footer.tsx` L21, L23 |
| B14 | **`/admin` sólo se protege client-side** — `PROTECTED_ROUTES` declarada y nunca usada | `proxy.ts` L5 |
| B15 | Botones muertos: "Ver Proyecto" (emprendimientos), "Registrarme como Profesional" (servicios) | sin `href`/`onClick` |
| B16 | `refreshRole` nunca se invoca tras aprobar usuarios | `AuthContext.tsx` |

### 🟡 Nivel 3 — Deuda técnica
- Helpers sin uso: `getPropertyTypes`, `getServiceCategories`, `createUserRole`, `uploadFiles`, `deleteStorageFile`, `updatePublicacion`, `getServiciosByUser`
- `useUIStore`: `isMapExpanded`, `toggleMapExpanded`, `activeModal`, `openModal`, `closeModal`
- Imports sin usar (ver §6, paso 4)
- **Naming inconsistente**: `package.json` = `antigravity-enterprise` · README = "Antigravity Enterprise" · dashboard = "Antigravity Enterprise" · metadata = "Bulacio Bienes Raíces"
- `README.md` completo desactualizado (menciona rutas que no existen)

> ✅ **`npx tsc --noEmit` pasa limpio (0 errores).** La deuda es funcional, no de tipos.

---

## 3. ALCANCE

### 3.1 ❌ SE ELIMINA

| Módulo | Archivos | Objetos DB |
|---|---|---|
| **Emprendimientos** | `src/app/emprendimientos/` (1) · `src/app/admin/emprendimientos/` (1) · `src/components/ProjectCarousel.tsx` | tabla `emprendimientos` + 5 policies |
| **Oportunidades** | `src/app/oportunidades/` (2) · `src/app/admin/oportunidades/` (1) · `src/components/OportunidadCard.tsx` | tabla `oportunidades` + 5 policies |
| **Noticias/Blog** | (no tenía páginas) — 6 helpers en `supabase.ts` L427-509, L684-699 | tabla `noticias` + policies + FK `publicaciones.noticia_id` |

**Ediciones en compartidos:** `src/lib/supabase.ts` (interfaces + ~300 líneas) · `Navbar.tsx` · `Footer.tsx` · `app/page.tsx` · `layout.tsx` (metadata SEO) · `admin/layout.tsx` · `admin/page.tsx` · `contacto/page.tsx` (textos) · `README.md`

### 3.2 ✅ SE MANTIENE (activo)

`/` · `/propiedades` + `/[id]` · `/fondos-de-comercio` · `/tasaciones` · `/nosotros` · `/contacto` · `/login` · `/registro` · `/legal/privacidad`
Admin: `propiedades` · `publicaciones` · `usuarios` · `configuracion` · `calculadora`

### 3.3 🆕 SE INCORPORA

1. **`/gestion-legal`** — sub-marca con acento propio · servicios: mora **extrajudicial** / **judicial** / **asesoramiento jurídico** · proceso paso a paso · **formulario de captación con datos del caso** (deudor, monto, días de mora, etapa) · **asistente Gemini** que deriva a bandeja + notifica al instante.
2. **Chat IA del agente inmobiliario reconstruido** — Edge Function `property-agent` + tabla `chat_conversations` + widget (Gemini).
3. **Calculadora ICL/IPC con datos reales del BCRA.**
4. **Paquete "Redes que rinden"** (ver §5).

### 3.4 🟡 QUEDA DORMIDO — `/servicios` (directorio de profesionales)

**No se elimina nada.** Se conserva íntegro para futura implementación:

- `src/app/servicios/page.tsx` · `src/app/servicios/[id]/page.tsx`
- `src/app/admin/servicios/page.tsx` (**el ítem del sidebar admin se mantiene** — permite precargar el equipo de trabajo)
- `src/components/ServiceCard.tsx` · `src/components/StarRating.tsx`
- `src/lib/mockServicios.ts`
- Tabla `servicios` + RLS + `supabase-migration-servicios-rls.sql`

**Acciones sobre el módulo dormido:**
| Acción | Detalle |
|---|---|
| Quitar links públicos | `Navbar.tsx` L18 y L28 · `Footer.tsx` L8 · banner de `servicios/page.tsx` L197 (apunta a `/oportunidades`, que se elimina) |
| `noindex` | Agregar `robots: { index: false }` al metadata de `/servicios` y `/servicios/[id]` |
| Mantener admin | Sidebar de `/admin/servicios` **se conserva** |
| Arreglar bugs internos | Doble Navbar en `servicios/[id]` L105 · import `Star` sin usar L19 |
| **Reactivación futura** | Volver a poner los 6 links + quitar el `noindex` |

### 3.5 Balance de rutas

**24 rutas → 20** (12 públicas + 7 admin + 1 nueva Gestión Legal).

---

## 4. FASES DE EJECUCIÓN

| Fase | Contenido | Responsable | Bloqueante |
|---|---|---|---|
| **F0 · Cimientos** | Copiar doc a `docs/` · Supabase nuevo + schema reescrito · deploy Vercel · clave Gemini | 🟡 Usuario / 🟢 Agente (schema) | **Sí** |
| **F1 · Recorte** | Eliminar emprendimientos + oportunidades + noticias; dejar `/servicios` dormido | 🟢 Agente | F0 parcial |
| **F2 · Reparación** | B7–B16 · código muerto · naming unificado | 🟢 Agente | — |
| **F3 · Gestión Legal** | Landing + sub-marca + formulario de caso + asistente + notificación | 🟢 Agente | F0 (Gemini) |
| **F4 · IA transversal** | `property-agent` + `chat_conversations` + widget | 🟢 Agente | F0 (Gemini) |
| **F5 · Calculadora BCRA** | API v4.0 + serie ICL/IPC + caché server-side | 🟢 Agente | — |
| **F6 · Redes** | Paquete "Redes que rinden" (ver §5) | 🟢 Agente | tokens redes |
| **F7 · Rediseño** | Buscador hero · ficha de propiedad · home · placeholders · naming | 🟢 Agente | F1+F2 |
| **F8 · Legal + Producción** | `/legal/terminos` · `/legal/cookies` · SEO · dominio · Lighthouse | 🟢 Agente / 🟡 dominio | todas |

**Orden:** F0 → F1 → F2 → (F3 ∥ F4 ∥ F5) → F6 → F7 → F8

---

## 5. PAQUETE "REDES QUE RINDEN" (F6)

Tres entregables, **$0 de infraestructura**, configurables desde `/admin/configuracion` sin tocar código:

| # | Entregable | Detalle |
|---|---|---|
| 1 | **Motor de formato** | Cada propiedad genera su post con plantilla (título · precio USD · m² · ambientes · zona), hashtags automáticos por zona, link con **UTM** (`utm_source/medium/campaign`) y **programación real** (hoy `scheduled_for` existe pero nadie lo consume → pg_cron o cron de Vercel) |
| 2 | **Compartir + feed** | Botón compartir en las fichas (WhatsApp / FB / IG / X) + feed de Instagram incrustado |
| 3 | **Pixel de Meta + GA4** | Eventos `ViewContent`, `Contact`, `Lead`. IDs cargables **por el panel admin** (tabla `site_config`), no por código |

**No se implementan campañas pagas (Ads API)** hasta que exista inventario real (fotos y propiedades).

---

## 6. BASE DE DATOS — PROYECTO NUEVO

**Decisión D16: se crea un proyecto Supabase nuevo.** Motivos: 6 defectos estructurales, definiciones duplicadas (estado real desconocido), cero datos reales que perder.

### 6.1 Schema nuevo — requisitos
- `get_my_role()` y `handle_new_user()` **antes** de cualquier `CREATE POLICY`
- `propiedades` **con** `is_featured` y `video_url`
- Tabla `chat_conversations` (columnas según interfaz `ChatConversation`)
- `social_media_config` **una sola definición** (la v2: plataformas `facebook/instagram/tiktok`, `UNIQUE(platform)`, con `refresh_token`/`expires_at`)
- Bucket `media` creado en SQL
- Tabla `servicios` **se conserva** (módulo dormido)
- Tablas `emprendimientos`, `oportunidades`, `noticias` **NO se crean**
- Trigger de `updated_at`
- Seed: `site_config.contact_info` + promoción a superadmin
- Índices corregidos (`idx_publicaciones_pending` con `OR` es inútil)

### 6.2 Eliminación (sólo aplica si se reutiliza el proyecto viejo)
```sql
DROP TABLE IF EXISTS emprendimientos CASCADE;
DROP TABLE IF EXISTS oportunidades CASCADE;
DROP TABLE IF EXISTS noticias CASCADE;   -- ojo: antes dropear FK publicaciones.noticia_id
```

### 6.3 Reparto de tareas
| Quién | Tarea |
|---|---|
| 🟡 Usuario | Crear proyecto Supabase → enviar **Project URL** + **anon key** |
| 🟢 Agente | Escribir schema completo |
| 🟡 Usuario | Pegar SQL en SQL Editor · crear bucket `media` · registrarse en `/registro` → enviar email |
| 🟡 Usuario | Actualizar `.env.local` con credenciales nuevas |

---

## 7. PLAN DE TESTING DE FUNCIONAMIENTO

### 7.1 Pruebas estáticas (automatizadas)

| # | Prueba | Criterio de aceptación |
|---|---|---|
| T1 | `npm run lint` | 0 errores |
| T2 | `npx tsc --noEmit` | 0 errores |
| T3 | `npm run build` | Build exitoso, sin warnings de hidratación |
| T4 | `grep -r "oportunidades\|emprendimientos\|noticias" src/` | 0 resultados (salvo el módulo dormido) |
| T5 | Verificar que `/oportunidades`, `/emprendimientos` devuelven **404** | 404 |

### 7.2 Pruebas manuales — Sitio público

| # | Ruta | Qué verificar |
|---|---|---|
| P1 | `/` | Carga sin errores de consola · carruseles OK · **sin secciones de emprendimientos ni oportunidades** |
| P2 | `/propiedades` | Filtros operación/tipo/precio funcionan · sin `dynamic` ni `isMapExpanded` muertos |
| P3 | `/propiedades/[id]` | **Una sola navbar** · galería · amenities · mapa con token · **formulario de contacto persiste en `contact_messages`** |
| P4 | `/fondos-de-comercio` | Lista sólo `type='fondo_comercio'` |
| P5 | `/tasaciones` | **La solicitud persiste en la DB** (ya no `alert()`) |
| P6 | `/contacto` | Persiste · sanitización · cooldown anti-spam |
| P7 | `/gestion-legal` | Landing completa · formulario de caso persiste con `source='gestion-legal'` · **asistente responde** · **email llega al asesor** |
| P8 | `/servicios` y `/servicios/[id]` | **Funcionan** (dormido) · **una sola navbar** · **NO aparecen en Navbar/Footer** · `noindex` en meta |
| P9 | Navbar + Footer | **0 links rotos** — verificar cada href |
| P10 | `/login` → redirige a **`/admin`** | ✅ |
| P11 | `/registro` | Registro OK · se crea `user_roles` con `pending` |
| P12 | `/nosotros`, `/legal/privacidad` | Render correcto |

### 7.3 Pruebas manuales — Panel admin

| # | Módulo | Qué verificar |
|---|---|---|
| A1 | Acceso | Sin sesión → `/login` · rol `pending` → "Aprobación Pendiente" · `admin` → entra · `superadmin` → entra · **rutas `/admin/*` protegidas server-side** |
| A2 | `/admin` (dashboard) | **Datos reales de la DB**, ya no mock · sin "Antigravity" |
| A3 | `/admin/propiedades` | Crear · editar · eliminar · subir imágenes · marcar **destacado** → **verificar en Table Editor que la fila se creó con `is_featured`** |
| A4 | `/admin/servicios` | CRUD completo sigue operativo (módulo dormido) |
| A5 | `/admin/publicaciones` | Crear · programar · publicar a FB/IG/TikTok |
| A6 | `/admin/usuarios` | Aprobar · rechazar · revocar · `refreshRole` se refleja |
| A7 | `/admin/configuracion` | Guardar `contact_info` · bandeja de mensajes · tokens de redes |
| A8 | `/admin/calculadora` | **Índices reales del BCRA** (API v4.0), no datos de ejemplo |

### 7.4 Pruebas de IA

| # | Prueba | Criterio |
|---|---|---|
| I1 | Chat de propiedad | Edge Function `property-agent` responde · la conversación **queda guardada en `chat_conversations`** |
| I2 | Asistente Gestión Legal | Hace las preguntas del caso · arma el resumen · **queda en la bandeja** · **dispara el email al asesor** |
| I3 | Límite de Gemini | Verificar que no se agota la cuota gratuita con tráfico normal |

### 7.5 Pruebas de Storage

| # | Prueba |
|---|---|
| S1 | Subir imagen desde cada módulo admin → OK |
| S2 | Eliminar registro → la imagen se borra del bucket |
| S3 | Verificar que no quedan carpetas huérfanas (`emprendimientos/`, `oportunidades/`) |

### 7.6 Pruebas de seguridad / RLS

| # | Prueba | Esperado |
|---|---|---|
| R1 | Consulta anónima (`anon key`) a `propiedades` | SELECT OK, INSERT rechazado |
| R2 | Usuario `admin` intenta editar propiedad de otro | Rechazado |
| R3 | Usuario `pending` entra a `/admin` | Bloqueado |
| R4 | Sin sesión, llamada directa a `/admin/propiedades` | Redirigido a `/login` |
| R5 | `contact_messages` — INSERT anónimo | Permitido (es el canal de contacto) |

### 7.7 Pruebas responsive y visual

| # | Viewport | Qué verificar |
|---|---|---|
| V1 | Desktop 1440px | Layout completo, sin scroll horizontal |
| V2 | Tablet 768px | Menú colapsa, grillas a 2 columnas |
| V3 | Mobile 375px | Menú hamburguesa, forms usables, targets ≥44px |
| V4 | Todos | Sin doble navbar · sin placeholders rotos · contraste de texto OK |

### 7.8 Pruebas de producción (F8)

| # | Prueba |
|---|---|
| PR1 | Dominio resuelve + HTTPS válido |
| PR2 | `metadataBase` y URLs de SEO actualizados al dominio final |
| PR3 | Lighthouse ≥ 90 en Performance / SEO / Accessibility / Best Practices |
| PR4 | `robots.txt` y `sitemap.xml` generados |
| PR5 | 404 personalizado |
| PR6 | Emails transaccionales llegan (Resend) desde el dominio propio |
| PR7 | Smoke test completo de las 20 rutas |

### 7.9 Responsabilidad en testing

| Quién | Qué testea |
|---|---|
| 🟢 Agente | T1–T5 · P1–P12 · A1–A8 · I1–I3 · S1–S3 · R1–R5 · V1–V4 · PR1–PR5 |
| 🟡 Usuario | **I2 (email real al asesor)** · **A5 (publicación real en tus redes)** · PR6 · revisión de contenidos y textos · verificación visual final en su dispositivo |

---

## 8. LO QUE FALTA DEL USUARIO (bloqueantes)

| # | Item | Bloquea | Estado |
|---|---|---|---|
| 1 | Proyecto Supabase nuevo → **Project URL** + **anon key** | F0, F1, F2 | ⏳ |
| 2 | Clave de **Gemini** | F3, F4 | ⏳ |
| 3 | Cuenta **Vercel** + import del repo + env vars | deploy | ⏳ |
| 4 | Comprar **`bulaciobienesraices.com`** en Vercel | F8 | ⏳ |
| 5 | Tokens de **Facebook / Instagram / TikTok** | F6 | ⏳ |
| 6 | Datos de contacto reales (teléfono, email, dirección, horarios) de la firma | F7, F8 | ⏳ |
| 7 | Contenido de Gestión Legal: textos, proceso, alcance territorial, matrícula si corresponde | F3 | ⏳ |

---

## 9. RIESGOS

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Cuota gratuita de Gemini | Los chatbots dejan de responder | Monitorear uso; clave única para ambos; degradar a formulario |
| Edge Functions de Supabase (500K/mes gratis) | Límite alcanzado | Holgado para el volumen esperado; monitorear |
| `.env.local` apunta a la DB vieja | Rompe todo | Reemplazar completo, no parchear |
| `supabase-migration-servicios-rls.sql` modificado sin commitear | Péder trabajo tuyo | Revisar el diff antes de tocarlo |
| Naming inconsistente | Confusión en dominio/marca | Unificar en F7: **un nombre, un dominio** |
| Recorte rompe imports | Build falla | T3 (`npm run build`) en cada fase |

---

## 10. CHECKLIST DE ENTREGA

- [ ] `docs/PLAN-REBUILD.md` copiado al repositorio
- [ ] F0 — Supabase nuevo + Vercel + Gemini configurados
- [ ] F1 — Recorte completo, 0 referencias a módulos eliminados
- [ ] F2 — Bugs B7–B16 resueltos
- [ ] F3 — `/gestion-legal` operativa con asistente y notificación
- [ ] F4 — Chat IA reconstruido y persistiendo
- [ ] F5 — Calculadora con datos reales del BCRA
- [ ] F6 — Paquete "Redes que rinden"
- [ ] F7 — Rediseño estructural + placeholders + naming unificado
- [ ] F8 — Legal, SEO, dominio, Lighthouse
- [ ] **Testing completo (§7) — 0 errores**
- [ ] Aprobación del usuario
