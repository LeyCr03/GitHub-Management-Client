/**
 * Vista de folders (tags) con proyectos agrupados
 * Issue 06 - Dashboard y FoldersView
 *
 * Muestra:
 * - Folders (tags) con iconos coloreados
 * - Proyectos agrupados por tag
 * - Folders expandibles/colapsibles
 * - Filtrado por tag seleccionado
 */

import { useMemo, useState } from 'react'
import { useGithubProjects } from '@/hooks'
import { Project, Tag } from '@/types'
import { ProjectCard } from './ProjectCard'
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
    <div className="space-y-8 p-6">
      {filteredTags.map(([tag, tagProjects]: [Tag, Project[]]) => (
        <div key={tag.id}>
          {/* Folder Header */}
          <button
            onClick={() => toggleFolder(tag.id)}
            className="flex items-center gap-3 mb-4 group cursor-pointer hover:opacity-80 transition-opacity"
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
