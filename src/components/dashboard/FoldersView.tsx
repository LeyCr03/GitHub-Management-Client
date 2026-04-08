/**
 * Vista de folders (tags) con proyectos agrupados - Mejorada
 * Issue 06 - Dashboard y FoldersView
 * Issue 12 - Rediseño UI Moderno
 *
 * Muestra:
 * - Folders (tags) con iconos coloreados en grid
 * - Proyectos agrupados por tag
 * - Welcome message
 * - Latest projects section
 * - Filtrado por tag seleccionado
 */

import { useMemo, useState } from 'react'
import { useGithubProjects } from '@/hooks'
import { Project, Tag } from '@/types'
import { ProjectCard } from './ProjectCard'
import { FolderCard } from './FolderCard'
import { FolderOpen } from 'lucide-react'

interface FoldersViewProps {
  selectedTagId?: string | null
  onProjectSelect?: (projectId: string) => void
}

export const FoldersView = ({
  selectedTagId,
  onProjectSelect,
}: FoldersViewProps) => {
  const { projects, tags, isLoading, isError } = useGithubProjects()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  /**
   * Organiza proyectos por tags
   * Crea un Map donde la clave es el tag y el valor es el array de proyectos
   */
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

  /**
   * Filtra tags por el seleccionado
   * Si no hay selección, muestra todos
   */
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
        <div className="text-muted-foreground">Cargando proyectos...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">Error al cargar proyectos</div>
      </div>
    )
  }

  if (filteredTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-foreground">No hay proyectos</h2>
        <p className="text-muted-foreground">
          Crea algunos tags y agrupa tus proyectos de GitHub
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10 p-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome Back! 👋
        </h1>
        <p className="text-muted-foreground">
          Tienes {projects?.length || 0} proyectos organizados en {tags?.length || 0} carpetas
        </p>
      </div>

      {/* Folders Grid */}
      {filteredTags.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            📁 Folders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map(([tag]: [Tag, Project[]]) => (
              <FolderCard
                key={tag.id}
                tag={tag}
                onSelect={() => toggleFolder(tag.id)}
                isSelected={expandedFolders.has(tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Projects */}
      {filteredTags.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            📌 Latest Projects
          </h2>
          <div className="space-y-8">
            {filteredTags.map(([tag, tagProjects]: [Tag, Project[]]) => (
              expandedFolders.has(tag.id) && tagProjects.length > 0 && (
                <div key={tag.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <h3 className="font-semibold text-foreground">{tag.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      ({tagProjects.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tagProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={onProjectSelect}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
