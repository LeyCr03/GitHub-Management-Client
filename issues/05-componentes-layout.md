# Issue 5: Implementar Componentes de Layout

## Objetivo
Crear la estructura visual base del dashboard (Sidebar, Header, MainLayout).

## Tareas

### 1. Crear MainLayout
**Archivo:** `src/components/layout/MainLayout.tsx`

```typescript
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import '../../../src/styles/layout.css'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
```

### 2. Crear Sidebar
**Archivo:** `src/components/layout/Sidebar.tsx`

```typescript
import { useState } from 'react'
import { useGithubProjects } from '@/hooks'
import { Tag } from '@/types'
import { Button } from '@/components/ui/button'
import { FolderIcon, Plus } from 'lucide-react'
import classNames from 'classnames'

interface SidebarProps {
  onTagSelect?: (tagId: string | null) => void
  selectedTagId?: string | null
}

export const Sidebar = ({ onTagSelect, selectedTagId }: SidebarProps) => {
  const { tags, isLoading } = useGithubProjects()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (tagId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId)
    } else {
      newExpanded.add(tagId)
    }
    setExpandedFolders(newExpanded)
  }

  if (isLoading) {
    return (
      <aside className="w-64 bg-sidebar border-r border-border p-4">
        <div>Cargando tags...</div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-border p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">GitHub Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tus repositorios</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onTagSelect?.(null)}
        >
          <FolderIcon className="w-4 h-4 mr-2" />
          Todos los proyectos
        </Button>
      </div>

      {/* Folders/Tags */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
          Carpetas (Tags)
        </h2>

        {tags?.map((tag: Tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect?.(tag.id)}
            className={classNames(
              'w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-colors',
              selectedTagId === tag.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            )}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="flex-1 text-left text-sm">{tag.name}</span>
            <span className="text-xs bg-background/20 px-2 py-0.5 rounded">
              {/* Aquí iría el count de proyectos */}
            </span>
          </button>
        ))}

        {/* Add new tag button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground mt-4"
          // onClick={() => setShowCreateTag(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo tag
        </Button>
      </div>
    </aside>
  )
}
```

### 3. Crear Header
**Archivo:** `src/components/layout/Header.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Settings } from 'lucide-react'

export const Header = () => {
  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
```

### 4. Crear estilos de layout
**Archivo:** `src/styles/layout.css`

```css
/* Variables CSS */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --sidebar: 0 0% 96%;
  --border: 0 0% 89.8%;
  --muted: 0 0% 89.8%;
  --primary: 200 100% 50%;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --sidebar: 0 0% 10%;
    --border: 0 0% 20%;
    --muted: 0 0% 20%;
    --primary: 200 100% 50%;
  }
}

.bg-background {
  background-color: hsl(var(--background));
}

.bg-sidebar {
  background-color: hsl(var(--sidebar));
}

.border-border {
  border-color: hsl(var(--border));
}

.text-foreground {
  color: hsl(var(--foreground));
}

.text-muted-foreground {
  color: hsl(var(--muted));
}

.bg-muted {
  background-color: hsl(var(--muted));
}

.bg-primary {
  background-color: hsl(var(--primary));
}

.text-primary-foreground {
  color: white;
}
```

## Criterios de Aceptación
- ✅ MainLayout estructura correcta
- ✅ Sidebar muestra tags y permite filtrar
- ✅ Header con buscador
- ✅ Estilos CSS aplicados
- ✅ Responsive design básico
- ✅ TypeScript sin errores

## Próximos Pasos
- Conectar el filtrado de tags al componente padre
- Implementar búsqueda en Header
- Agregar animaciones (opcional)
