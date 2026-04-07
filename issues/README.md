# GitHub Dashboard - Roadmap de Implementación

Este directorio contiene todos los pasos necesarios para completar el proyecto del Dashboard de GitHub Management Client.

## 📋 Índice de Issues

| # | Título | Descripción | Tiempo Est. |
|---|--------|-------------|------------|
| 01 | [Setup Inicial](./01-setup-inicial.md) | Configurar proyecto, dependencias y estructura base | 30 min |
| 02 | [Tipos TypeScript](./02-tipos-typescript.md) | Definir toda la estructura de tipos | 45 min |
| 03 | [Cliente API](./03-cliente-api.md) | Implementar cliente HTTP y helpers | 45 min |
| 04 | [Hooks Personalizados](./04-hooks-personalizados.md) | Crear hooks para fetch de datos con SWR | 60 min |
| 05 | [Componentes Layout](./05-componentes-layout.md) | Sidebar, Header, MainLayout | 60 min |
| 06 | [Dashboard y FoldersView](./06-dashboard-y-folders-view.md) | Vista principal con proyectos por tags | 90 min |
| 07 | [Project Detail](./07-project-detail.md) | Modal con README, commits, imágenes | 120 min |
| 08 | [Tags Editor](./08-tags-editor.md) | Modal para crear/editar tags | 75 min |
| 09 | [Componentes UI](./09-componentes-ui.md) | Card, Dialog, Tabs, Badge, Input | 60 min |
| 10 | [Integración Final](./10-integracion-final.md) | Polish, validaciones, error handling | 75 min |

**⏱️ Tiempo Total Estimado: ~9.5 horas**

---

## 🎯 Recomendación de Orden

Se recomienda seguir el orden numérico ya que cada issue construye sobre los anteriores:

```
Setup → Tipos → API → Hooks → Layout → Dashboard → Detail → Tags → UI → Integración
```

### Orden Alternativo (Opcional)
Si prefieres trabajar en paralelo:

**Grupo A (Backend Setup):**
- Issue 01: Setup Inicial
- Issue 02: Tipos TypeScript
- Issue 03: Cliente API

**Grupo B (Frontend Base):**
- Issue 05: Componentes Layout
- Issue 09: Componentes UI

**Grupo C (Features):**
- Issue 04: Hooks
- Issue 06: Dashboard
- Issue 07: Project Detail
- Issue 08: Tags Editor

**Grupo D (Polish):**
- Issue 10: Integración Final

---

## 🗂️ Estructura del Proyecto Final

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── FoldersView.tsx
│   │   └── ProjectCard.tsx
│   ├── project/
│   │   ├── ProjectDetailModal.tsx
│   │   ├── ReadmePreview.tsx
│   │   ├── CommitsList.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ProjectMetadata.tsx
│   │   ├── TagsEditorModal.tsx
│   │   └── ProjectDetailModal.tsx
│   └── ui/
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       └── code.tsx
├── hooks/
│   ├── useGithubProjects.ts
│   ├── useProjectDetail.ts
│   ├── useReadmeContent.ts
│   ├── useProjectCommits.ts
│   ├── useTagManagement.ts
│   └── index.ts
├── types/
│   ├── github.ts
│   ├── tags.ts
│   ├── project.ts
│   ├── api.ts
│   └── index.ts
├── lib/
│   ├── axios-instance.ts
│   ├── api.ts
│   ├── helpers.ts
│   ├── swr-config.ts
│   ├── toast.ts
│   └── utils.ts
├── constants/
│   └── tag-colors.ts
├── pages/
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── components/
│   └── ErrorBoundary.tsx
├── stores/
│   └── (Para uso futuro)
├── styles/
│   ├── layout.css
│   └── (Otros estilos)
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

---

## ✅ Checklist General

Use este checklist para rastrear el progreso:

### Preparación
- [ ] Issue 01 completado
- [ ] Issue 02 completado
- [ ] Issue 03 completado

### Frontend Base
- [ ] Issue 05 completado
- [ ] Issue 09 completado

### Features
- [ ] Issue 04 completado
- [ ] Issue 06 completado
- [ ] Issue 07 completado
- [ ] Issue 08 completado

### Finalización
- [ ] Issue 10 completado
- [ ] Todos los tests pasen
- [ ] No hay errores en consola
- [ ] Responsive en mobile/tablet/desktop
- [ ] Performance OK (Lighthouse > 80)

---

## 🔧 Herramientas y Dependencias

### Frontend
- **React** 19.2.3
- **Vite** 7.3.1
- **TypeScript** 5.x
- **Tailwind CSS** 3.x
- **Zustand** (state management)
- **SWR** (data fetching)
- **Axios** (HTTP client)
- **Radix UI** (headless components)
- **Lucide React** (icons)
- **Sonner** (toasts)

### Desarrollo
- **ESLint** + **Prettier**
- **Vite** dev server
- **pnpm** package manager

---

## 🚀 Cómo Empezar

### 1. Comienza con Issue 01
```bash
# Lee las instrucciones
cat issues/01-setup-inicial.md

# Sigue cada tarea
# Verifica que todo funcione: pnpm dev
```

### 2. Procede al Issue 02
```bash
cat issues/02-tipos-typescript.md
# Crea los archivos de tipos en src/types/
```

### 3. Continúa así...
Sigue el orden numérico completando cada issue.

---

## 💡 Tips Importantes

### Durante la Implementación
- **Commit frecuentemente** después de cada issue completado
- **Test en el navegador** mientras avanzas
- **Lee todo el issue** antes de empezar
- **Verifica TypeScript** (`pnpm tsc --noEmit`)

### Troubleshooting
- Si hay errores de import, verifica que la ruta sea correcta
- Si SWR no funciona, revisa el hook y el API client
- Si los estilos no se aplican, revisa Tailwind config

### Performance
- Usa Lighthouse para auditar (Chrome DevTools)
- Virtualiza listas largas (Issue 06 menciona react-window)
- Lazy load imágenes siempre

---

## 📞 Soporte

Si encuentras problemas:

1. **Lee el issue completo** - Probablemente tenga la solución
2. **Verifica tipos TypeScript** - `pnpm tsc --noEmit`
3. **Revisa la consola del navegador** - Busca errores
4. **Compara con el código del issue** - Asegúrate de seguir exactamente

---

## 🎨 Design Reference

El design está basado en el mockup de TaskFlow proporcionado:
- Grid de folders/tags con proyectos
- Cards con portada, descripción, stats
- Modal detail con tabs (README, commits, imágenes, info)
- Sidebar con navegación por tags

---

## 📊 Progreso

Usa este template para reportar progreso:

```markdown
## Progreso Actual

**Issues Completados:**
- [x] 01 Setup Inicial
- [ ] 02 Tipos TypeScript
- [ ] 03 Cliente API
...

**Bloqueadores:**
- Ninguno por ahora

**Próximo Step:**
- Issue 02
```

---

## 🔐 Notas de Seguridad

- Never commit `.env.local` con secretos reales
- Validate todos los inputs del usuario
- Sanitize markdown content en README preview
- Use HTTPS en producción
- Rate limit API calls si es necesario

---

## 📝 Cambios Recientes

**Versión 1.0** - Roadmap inicial
- 10 issues estructurados
- Orden recomendado
- Estructura completa de proyecto

---

**¡Listo para empezar? Abre [Issue 01: Setup Inicial](./01-setup-inicial.md)!**
