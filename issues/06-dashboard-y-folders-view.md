# Issue 6: Dashboard y FoldersView

## Objetivo
Crear la vista principal que muestra los proyectos organizados por tags (folders).

## Tareas

### 1. Crear FoldersView
**Archivo:** `src/components/dashboard/FoldersView.tsx`

```typescript
import { useMemo, useState } from 'react'
import { useGithubProjects } from '@/hooks'
import { Project, Tag } from '@/types'
import { ProjectCard } from './ProjectCard'
import { Card } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'
import classNames from 'classnames'

interface FoldersViewProps {
  selectedTagId?: string | null
}

export const FoldersView = ({ selectedTagId }: FoldersViewProps) => {
  const { projects, tags, isLoading, isError } = useGithubProjects()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Organizar proyectos por tags
  const projectsByTag = useMemo(() => {
    if (!projects || !tags) return new Map()

    const grouped = new Map<Tag, Project[]>()

    // Inicializar todos los tags
    tags.forEach((tag) => {
      grouped.set(tag, [])
    })

    // Agrupar proyectos
    projects.forEach((project) => {
      project.tags.forEach((projectTag) => {
        const fullTag = tags.find((t) => t.id === projectTag.id)
        if (fullTag) {
          const current = grouped.get(fullTag) || []
          grouped.set(fullTag, [...current, project])
        }
      })
    })

    return grouped
  }, [projects, tags])

  // Filtrar por tag seleccionado
  const filteredTags = useMemo(() => {
    const items = Array.from(projectsByTag.entries())
    if (!selectedTagId) return items

    return items.filter(([tag]) => tag.id === selectedTagId)
  }, [projectsByTag, selectedTagId])

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
      <div className="flex items-center justify-center h-full">
        <div>Cargando proyectos...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Error al cargar proyectos</div>
      </div>
    )
  }

  if (filteredTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No hay proyectos</h2>
        <p className="text-muted-foreground">
          Crea algunos tags y agrupa tus proyectos de GitHub
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {filteredTags.map(([tag, tagProjects]) => (
        <div key={tag.id}>
          {/* Folder Header */}
          <button
            onClick={() => toggleFolder(tag.id)}
            className="flex items-center gap-3 mb-4 group cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center bg-background group-hover:bg-muted transition-colors"
              style={{ borderColor: tag.color, borderWidth: '2px' }}
            >
              <FolderOpen
                className="w-4 h-4"
                style={{ color: tag.color }}
              />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{tag.name}</h2>
            <span className="ml-2 px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
              {tagProjects.length} proyecto{tagProjects.length !== 1 ? 's' : ''}
            </span>
          </button>

          {/* Projects Grid */}
          {expandedFolders.has(tag.id) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-9">
              {tagProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
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

### 2. Crear ProjectCard
**Archivo:** `src/components/dashboard/ProjectCard.tsx`

```typescript
import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helpers'
import classNames from 'classnames'

interface ProjectCardProps {
  project: Project
  onSelect?: (projectId: string) => void
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onSelect?.(project.id)}
    >
      {/* Cover Image */}
      {project.coverImage && (
        <div className="mb-4 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden">
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {project.description || 'Sin descripción'}
          </p>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {abbreviateNumber(project.stats.stars)}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            {abbreviateNumber(project.stats.forks)}
          </div>
          {project.stats.language && (
            <span className="px-2 py-1 bg-muted rounded text-xs">
              {project.stats.language}
            </span>
          )}
        </div>

        {/* Action */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          asChild
        >
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <span>Ver en GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  )
}
```

### 3. Crear Dashboard Page
**Archivo:** `src/pages/Dashboard.tsx`

```typescript
import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'

export const DashboardPage = () => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)

  return (
    <MainLayout>
      {/* Pasar estado al layout si es necesario */}
      <FoldersView selectedTagId={selectedTagId} />
    </MainLayout>
  )
}
```

### 4. Actualizar App.tsx
**Archivo:** `src/App.tsx`

```typescript
import { DashboardPage } from '@/pages/Dashboard'
import '@/index.css'

function App() {
  return (
    <DashboardPage />
  )
}

export default App
```

## Criterios de Aceptación
- ✅ FoldersView muestra proyectos agrupados por tags
- ✅ ProjectCard renderiza correctamente con todos los datos
- ✅ Click en folder expande/contrae proyectos
- ✅ Click en proyecto abre detalles (próximo issue)
- ✅ Imágenes se cargan con lazy loading
- ✅ Stats se muestran correctamente
- ✅ Responsive design en mobile/tablet/desktop
- ✅ No hay errores de TypeScript

## Notas de Diseño
- Las imágenes de portada deben ser 16:9 idealmente
- Los stats se abrevian (1000 → 1k)
- Las tarjetas tienen hover effects
- El diseño sigue el patrón del mockup (TaskFlow)

## ⚠️ Nota Importante para Integración Servidor (Issue 11)

Este componente será **actualizado en el Issue 11** para pasar `owner/repo` en lugar de `projectId`.

**Cambios que se harán en Issue 11:**
- Cambiar `onSelect` para pasar `owner/repo` en lugar de `projectId`
- Crear helper para convertir `project.url` a `owner/repo`
- Actualizar `ProjectDetailModal` para recibir `owner/repo`

Por ahora, implementa tal como está especificado.
