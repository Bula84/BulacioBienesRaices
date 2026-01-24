# 🚀 Antigravity Enterprise

**Plataforma Inmobiliaria de Próxima Generación**

Una moderna plataforma inmobiliaria construida con Next.js 14, featuring un explorador de propiedades inmersivo con mapas 3D, gestión de contenido dinámico con Supabase, y una estética "Antigravity" única.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E)

## ✨ Características

### 🏠 Explorador de Propiedades
- **Vista Split**: Filtros (20%) | Lista (40%) | Mapa 3D (40%)
- **Mapbox GL JS**: Mapa interactivo con vista 3D (pitch 45°)
- **Sincronización**: Hover en cards activa `flyTo` en el mapa
- **Animaciones**: Framer Motion con layout morphing
- **Filtros Real-time**: Por operación, tipo y rango de precio

### 📰 Blog Dinámico
- Artículos gestionados desde Supabase
- Cards con imagen, título, extracto y fecha
- Página de detalle con artículos relacionados

### 🔧 Marketplace de Servicios
- Directorio de profesionales de mantenimiento
- Filtrado por categorías
- Sistema de rating con estrellas
- Botones de contacto directo (WhatsApp, Email, Teléfono)

### 🎛️ Panel de Administración
- Dashboard con estadísticas
- CRUD completo de propiedades
- Editor de noticias
- Gestión de profesionales

### 🎨 Estética Antigravity
- **Glassmorphism**: `backdrop-blur-xl` y bordes translúcidos
- **Tema Cosmic**: Gradientes cyan-purple-pink
- **Levitación**: Efecto hover con `translateY(-12px)`
- **Bordes suaves**: `border-radius: 2.5rem`
- **Animaciones fluidas**: Transiciones suaves en todo

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **State Management**: Zustand
- **Animaciones**: Framer Motion
- **Mapas**: Mapbox GL JS
- **Base de Datos**: Supabase
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
cd antigravity-enterprise
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=tu_mapbox_token
```

### 3. Configurar la base de datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve al SQL Editor
3. Ejecuta el contenido de `supabase-schema.sql`
4. Esto creará las tablas y datos de ejemplo

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css          # Design system Antigravity
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Home
│   ├── propiedades/         # Explorador de propiedades
│   ├── nosotros/            # About us
│   ├── noticias/            # Blog
│   │   └── [id]/            # Detalle de artículo
│   ├── servicios/           # Marketplace
│   └── admin/               # Panel de administración
│       ├── propiedades/     # CRUD propiedades
│       ├── noticias/        # CRUD noticias
│       └── servicios/       # CRUD servicios
├── components/
│   ├── Navbar.tsx           # Navegación glassmorphism
│   ├── Footer.tsx           # Footer con links
│   ├── PropertyCard.tsx     # Card de propiedad
│   ├── PropertyFilters.tsx  # Panel de filtros
│   ├── PropertyMap.tsx      # Mapa Mapbox 3D
│   ├── NewsCard.tsx         # Card de noticia
│   ├── ServiceCard.tsx      # Card de servicio
│   └── StarRating.tsx       # Rating con estrellas
├── lib/
│   └── supabase.ts          # Cliente y funciones CRUD
└── store/
    └── propertyStore.ts     # Zustand stores
```

## 🎯 Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero, destacados y features |
| `/propiedades` | Explorador split-view con mapa 3D |
| `/nosotros` | Misión, visión, valores y equipo |
| `/noticias` | Blog con artículos dinámicos |
| `/noticias/[id]` | Detalle de artículo |
| `/servicios` | Marketplace de profesionales |
| `/admin` | Dashboard de administración |
| `/admin/propiedades` | Gestión de propiedades |
| `/admin/noticias` | Gestión de artículos |
| `/admin/servicios` | Gestión de servicios |

## 🗄️ Esquema de Base de Datos

### Propiedades
```sql
CREATE TABLE propiedades (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  operation TEXT CHECK (operation IN ('venta', 'alquiler')),
  type TEXT NOT NULL,
  m2 INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  coords_lat NUMERIC,
  coords_lng NUMERIC,
  image_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ
);
```

### Noticias
```sql
CREATE TABLE noticias (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT,
  created_at TIMESTAMPTZ
);
```

### Servicios
```sql
CREATE TABLE servicios (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  skill_tags TEXT[],
  contact TEXT,
  phone TEXT,
  email TEXT,
  rating NUMERIC,
  image_url TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ
);
```

## 🎨 Design Tokens

El sistema de diseño Antigravity incluye:

```css
/* Colores principales */
--primary-900: #0a0a1a;    /* Background más oscuro */
--accent-cyan: #00d4ff;     /* Acento primario */
--accent-purple: #a855f7;   /* Acento secundario */
--accent-pink: #ec4899;     /* Acento terciario */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.08);
--glass-border: rgba(255, 255, 255, 0.12);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

/* Bordes */
--radius-xl: 2.5rem;        /* Cards principales */
--radius-lg: 2rem;          /* Botones grandes */
--radius-md: 1.25rem;       /* Inputs */
```

## 📱 Responsive Design

- **Desktop**: Vista split completa con mapa
- **Tablet**: Mapa colapsable
- **Mobile**: Menú hamburguesa + botón flotante para mapa

## 🔒 Notas de Seguridad

El proyecto está configurado con datos mock para demostración. Para producción:

1. Configura Row Level Security (RLS) en Supabase
2. Implementa autenticación para el panel admin
3. Valida inputs en el servidor
4. Usa variables de entorno seguras

## 📄 Licencia

MIT License - úsalo como quieras para tu proyecto.

---

Desarrollado con 💜 usando la estética **Antigravity**
