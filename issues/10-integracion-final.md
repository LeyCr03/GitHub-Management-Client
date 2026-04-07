# Issue 10: Integración Final y Polish

## Objetivo
Integrar todos los componentes, agregar validaciones, error handling y mejorar la UX.

## Tareas

### 1. Configurar App.tsx completo
**Archivo:** `src/App.tsx`

```typescript
import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'
import { ProjectDetailModal } from '@/components/project/ProjectDetailModal'
import '@/index.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)

  return (
    <MainLayout>
      <FoldersView
        selectedTagId={selectedTagId}
        onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId)
          setDetailModalOpen(true)
        }}
      />
      
      <ProjectDetailModal
        projectId={selectedProjectId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </MainLayout>
  )
}

export default App
```

### 2. Mejorar FoldersView para pasar callbacks
**Actualizar:** `src/components/dashboard/FoldersView.tsx`

```typescript
interface FoldersViewProps {
  selectedTagId?: string | null
  onProjectSelect?: (projectId: string) => void
}

export const FoldersView = ({
  selectedTagId,
  onProjectSelect,
}: FoldersViewProps) => {
  // ... código existente ...

  return (
    <div className="space-y-8 p-6">
      {filteredTags.map(([tag, tagProjects]) => (
        <div key={tag.id}>
          {/* ... header ... */}
          {expandedFolders.has(tag.id) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-9">
              {tagProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={onProjectSelect}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### 3. Agregar toast notificaciones
**Instalar:**
```bash
pnpm add sonner
```

**Archivo:** `src/lib/toast.ts`

```typescript
import { toast } from 'sonner'

export const showSuccess = (message: string) => {
  toast.success(message)
}

export const showError = (message: string) => {
  toast.error(message)
}

export const showLoading = (message: string) => {
  return toast.loading(message)
}

export const updateToast = (toastId: string, message: string, type: 'success' | 'error') => {
  toast.dismiss(toastId)
  if (type === 'success') {
    toast.success(message)
  } else {
    toast.error(message)
  }
}
```

### 4. Mejorar TagsEditorModal con feedback
**Actualizar:** `src/components/project/TagsEditorModal.tsx`

```typescript
import { showSuccess, showError } from '@/lib/toast'

const handleCreateTag = async () => {
  if (!newTagName.trim()) {
    showError('El nombre del tag no puede estar vacío')
    return
  }

  const createdTag = await createTag(newTagName, newTagColor)
  if (createdTag) {
    setSelectedTags((prev) => [...prev, createdTag.id])
    setNewTagName('')
    setNewTagColor('#FF5733')
    setShowCreateForm(false)
    showSuccess(`Tag "${newTagName}" creado correctamente`)
  } else {
    showError('Error al crear el tag')
  }
}

const handleSave = async () => {
  const toastId = showLoading('Actualizando tags...')
  const success = await updateProjectTags(projectId, selectedTags)
  if (success) {
    updateToast(toastId, 'Tags actualizados correctamente', 'success')
    onSave?.(selectedTags)
    onOpenChange(false)
  } else {
    updateToast(toastId, 'Error al actualizar tags', 'error')
  }
}
```

### 5. Crear página 404
**Archivo:** `src/pages/NotFound.tsx`

```typescript
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Página no encontrada</p>
      <Button onClick={() => navigate('/')}>Volver al inicio</Button>
    </div>
  )
}
```

### 6. Agregar error boundary
**Archivo:** `src/components/ErrorBoundary.tsx`

```typescript
import React, { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('Error capturado:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 7. Actualizar main.tsx
**Archivo:** `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster position="bottom-right" />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

### 8. Mejorar index.css
**Archivo:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--border));
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slideInUp 0.3s ease-in-out;
}

/* Prose para markdown */
.prose {
  @apply text-foreground;
}

.prose code {
  @apply bg-muted rounded px-1.5 py-0.5 text-sm;
}

.prose pre {
  @apply bg-muted rounded-lg p-4 overflow-x-auto;
}

.prose pre code {
  @apply bg-transparent p-0;
}

.prose a {
  @apply text-primary hover:underline;
}

.prose h1 {
  @apply text-3xl font-bold mt-6 mb-4;
}

.prose h2 {
  @apply text-2xl font-bold mt-5 mb-3;
}

.prose h3 {
  @apply text-xl font-bold mt-4 mb-2;
}

.prose blockquote {
  @apply border-l-4 border-primary pl-4 italic text-muted-foreground;
}

.prose ul,
.prose ol {
  @apply ml-6;
}

.prose li {
  @apply mb-2;
}
```

### 9. Agregar validaciones en hooks
**Actualizar:** `src/hooks/useTagManagement.ts`

```typescript
const createTag = async (name: string, color: string): Promise<Tag | null> => {
  // Validar input
  if (!name.trim()) {
    setError('El nombre del tag es requerido')
    return null
  }

  if (name.length > 50) {
    setError('El nombre debe tener máximo 50 caracteres')
    return null
  }

  const colorRegex = /^#[0-9A-F]{6}$/i
  if (!colorRegex.test(color)) {
    setError('El color debe ser un código hex válido')
    return null
  }

  // ... resto del código ...
}
```

### 10. Crear README de desarrollo
**Archivo:** `DEVELOPMENT.md`

```markdown
# GitHub Dashboard - Guía de Desarrollo

## Setup

1. Clonar repositorio
2. Instalar dependencias: `pnpm install`
3. Crear `.env.local` desde `.env.example`
4. Ejecutar: `pnpm dev`

## Estructura del Proyecto

- `/src/components` - Componentes React
- `/src/hooks` - Custom hooks
- `/src/types` - Definiciones TypeScript
- `/src/lib` - Utilidades y helpers
- `/src/stores` - Estado global (Zustand)
- `/src/pages` - Páginas/vistas principales

## Flujo de Datos

```
API Server → axios instance → hooks (SWR) → components
                                    ↓
                             React state/Context
```

## Convenciones

- Components: PascalCase
- Hooks: useXxx
- Files: camelCase o PascalCase (components)
- Types: PascalCase con interfaz

## Testing

```bash
pnpm test
```

## Build

```bash
pnpm build
```

## Deploy

Ver guía en `DEPLOYMENT.md`
```

## Criterios de Aceptación
- ✅ App integrado completamente
- ✅ Toasts funcionan para feedback
- ✅ Error boundary en lugar
- ✅ Validaciones en inputs
- ✅ CSS mejorado
- ✅ No hay errores de console
- ✅ Responsive en todos los devices
- ✅ TypeScript sin warnings

## Próximos Pasos (Futuro)
- Tests unitarios
- E2E tests con Cypress
- Performance optimization
- SEO optimization
- PWA features
