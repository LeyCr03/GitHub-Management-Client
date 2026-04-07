# 🎨 GitHub Management Client - Dashboard

Un dashboard moderno para monitorear y gestionar tus proyectos de GitHub con tags personalizados, vista de commits y previsualizaciones de README.

## 📸 Características

✨ **Organización por Tags** - Agrupa tus repositorios en folders personalizados  
🎯 **Vista Detallada** - Mira README, commits e imágenes de cada proyecto  
🏷️ **Gestión de Tags** - Crea y edita tags directamente desde el dashboard  
📊 **Estadísticas** - Visualiza stars, forks e información del repositorio  
🎨 **Diseño Moderno** - Interfaz limpia con shadcn y Tailwind CSS  

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Ejecutar servidor de desarrollo
pnpm dev
```

## 📚 Guías

- **[Roadmap de Implementación](./issues/README.md)** - Pasos para completar el proyecto (10 issues)
- **[Guía de Desarrollo](./DEVELOPMENT.md)** - Setup, comandos, troubleshooting
- **[Issues Detallados](./issues/)** - Cada issue contiene código, explicaciones y criterios

## 🗂️ Estructura del Proyecto

```
src/
├── components/       # Componentes React
│   ├── layout/      # MainLayout, Sidebar, Header
│   ├── dashboard/   # FoldersView, ProjectCard
│   ├── project/     # Modals y detalles
│   └── ui/          # Componentes reutilizables
├── hooks/           # Custom hooks
├── types/           # TypeScript types
├── lib/             # API client, helpers, utils
├── constants/       # Constantes
└── pages/           # Páginas principales
```

## 📋 Issues (Roadmap)

El proyecto está dividido en **10 issues** progresivos:

| # | Titulo | Est. |
|---|--------|------|
| 01 | Setup Inicial | 30m |
| 02 | Tipos TypeScript | 45m |
| 03 | Cliente API | 45m |
| 04 | Hooks Personalizados | 60m |
| 05 | Componentes Layout | 60m |
| 06 | Dashboard y FoldersView | 90m |
| 07 | Project Detail | 120m |
| 08 | Tags Editor | 75m |
| 09 | Componentes UI | 60m |
| 10 | Integración Final | 75m |

**Total: ~9.5 horas**

→ [Ver roadmap completo](./issues/README.md)

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn
- **State**: SWR (data fetching) + Zustand (opcional)
- **HTTP**: Axios
- **Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner

## 💻 Desarrolladores

El proyecto está scaffold listo para empezar. Cada issue contiene:

- ✅ Código completo y funcional
- ✅ Explicaciones línea por línea
- ✅ Archivos exactos a crear/modificar
- ✅ Criterios de aceptación
- ✅ Tips y mejores prácticas

### Comenzar

1. Lee [el roadmap](./issues/README.md)
2. Sigue el [Issue 01: Setup Inicial](./issues/01-setup-inicial.md)
3. Continúa en orden numérico

## 🎨 Design Reference

El dashboard está basado en un design moderno tipo TaskFlow:

- Grid de folders (tags) con proyectos
- Cards con coverImage, stats, tags
- Modal detail con tabs (README, commits, imágenes, info)
- Sidebar navegable con filtros

## 📖 API Esperado

El cliente espera un servidor con estos endpoints:

```
GET    /api/projects              - Obtener todos los proyectos
GET    /api/projects/:id          - Obtener detalles del proyecto
GET    /api/projects/:id/readme   - Obtener contenido README
GET    /api/projects/:id/commits  - Obtener commits del proyecto
PATCH  /api/projects/:id/tags     - Actualizar tags
GET    /api/tags                  - Obtener todos los tags
POST   /api/tags                  - Crear nuevo tag
DELETE /api/tags/:id              - Eliminar tag
```

Ver tipos en `src/types/api.ts`

## 🔐 Seguridad

- ✅ Input validation en formularios
- ✅ CORS configurado en servidor
- ✅ Tokens en localStorage (configurar según necesidad)
- ✅ Markdown sanitizado en previews

## 📱 Responsive

- ✅ Mobile first design
- ✅ Tablet optimized
- ✅ Desktop enhanced
- ✅ Touch friendly

## 🚢 Deployment

Ver [guía de deployment](./DEPLOYMENT.md) (próximamente)

## 📄 Licencia

Proyecto personal de GitHub Management

---

**¿Listo para empezar? → [Abre el Roadmap](./issues/README.md)**
