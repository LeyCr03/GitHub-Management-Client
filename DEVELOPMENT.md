# GitHub Dashboard - Guía de Desarrollo

## 📚 Comenzar

1. **Leer el roadmap**: Abre `/issues/README.md`
2. **Seguir en orden**: Completa cada issue numerado (01-10)
3. **Verificar progreso**: Usa el checklist del roadmap

## 🗂️ Estructura

```
src/
├── components/    # Componentes React (layout, dashboard, project, ui)
├── hooks/         # Custom hooks reutilizables
├── types/         # Definiciones TypeScript
├── lib/           # Utilidades, API client, helpers
├── constants/     # Constantes (colores, etc)
├── pages/         # Páginas principales
└── stores/        # Estado global (Zustand - futuro)
```

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev

# Build para producción
pnpm build

# Preview build
pnpm preview

# Linting
pnpm lint

# Verificar tipos
pnpm tsc --noEmit
```

## 📋 Issues y Tareas

Todos los issues están en la carpeta `/issues/`:

| Issue | Título | Tiempo |
|-------|--------|--------|
| 01 | Setup Inicial | 30 min |
| 02 | Tipos TypeScript | 45 min |
| 03 | Cliente API | 45 min |
| 04 | Hooks Personalizados | 60 min |
| 05 | Componentes Layout | 60 min |
| 06 | Dashboard y FoldersView | 90 min |
| 07 | Project Detail | 120 min |
| 08 | Tags Editor | 75 min |
| 09 | Componentes UI | 60 min |
| 10 | Integración Final | 75 min |

## 🔧 Stack Técnico

- **React 19** + **TypeScript**
- **Vite** (bundler)
- **Tailwind CSS** (estilos)
- **Radix UI** (componentes base)
- **SWR** (data fetching)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **Sonner** (toasts)

## 💡 Tips Importantes

### Mientras trabajas en cada issue:

1. **Lee el issue completo** antes de empezar
2. **Crea los archivos** en las rutas especificadas
3. **Sigue el código exactamente** - los detalles importan
4. **Verifica TypeScript**: `pnpm tsc --noEmit`
5. **Prueba en el navegador**: `pnpm dev`
6. **Commit frecuentemente** después de cada issue

### Troubleshooting:

- **Errores de import**: Verifica rutas (usa `@/` para src)
- **TypeScript errors**: Lee el error, suele indicar el problema
- **Estilos no aplican**: Verifica que Tailwind esté configurado
- **API no responde**: Verifica que el servidor backend corra

## 🔐 Configuración

1. Copia `.env.example` a `.env.local`
2. Actualiza los valores según tu setup
3. **No commites `.env.local`**

```bash
cp .env.example .env.local
```

## 📊 Progreso

Marca tu progreso en el [roadmap de issues](./issues/README.md):

- [x] Issue 01 completado
- [ ] Issue 02 en progreso...
- [ ] Issue 03 próximo

## 🎯 Objetivos

El proyecto implementa un dashboard para gestionar proyectos GitHub:

✅ Organizar proyectos por tags (folders)  
✅ Ver detalles: README, commits, imágenes  
✅ Crear/editar tags desde el dashboard  
✅ UI moderna con Tailwind + shadcn  
✅ Integración con tu API backend  

## 📞 Ayuda

Si encuentras problemas:

1. **Revisa el issue** - probablemente tenga la solución
2. **Verifica la consola del navegador** - busca errores
3. **Compara tu código** con el del issue
4. **Consulta la documentación**:
   - [React Docs](https://react.dev)
   - [TypeScript Docs](https://www.typescriptlang.org/)
   - [Tailwind Docs](https://tailwindcss.com/)

## 📝 Notas

- El proyecto usa **componentes funcionales** con hooks
- Los tipos están en `/src/types/` - úsalos siempre
- El API client está centralizado en `/src/lib/api.ts`
- Los componentes del layout están en `/src/components/layout/`

---

**¿Listo para empezar? → Abre `/issues/01-setup-inicial.md`**
