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

import { useMemo } from 'react'
import { useGithubProjects } from '@/hooks'
import { Project, Tag } from '@/types'
import { FolderCard } from './FolderCard'
import { FileCard } from './FileCard'
import { Folder, FolderOpen } from 'lucide-react'

interface FoldersViewProps {
  selectedTagId?: string | null
  onProjectSelect?: (projectId: string) => void
  onFolderSelect?: (folderId: string) => void
}

export const FoldersView = ({
  selectedTagId,
  onProjectSelect,
  onFolderSelect,
}: FoldersViewProps) => {
  const { projects, tags, isLoading, isError } = useGithubProjects()

  const projectsByTag = useMemo(() => {
    if (!projects || !tags) return new Map()

    const grouped = new Map<Tag, Project[]>()

   
    tags.forEach((tag) => {
      grouped.set(tag, [])
    })

   
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


  const filteredTags = useMemo(() => {
    const items = Array.from(projectsByTag.entries())
    if (!selectedTagId) return items

    return items.filter(([tag]) => tag.id === selectedTagId)
  }, [projectsByTag, selectedTagId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">Error loading files</div>
      </div>
    )
  }

  if (filteredTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-foreground">No projects found</h2>
        <p className="text-muted-foreground">
          Create some tags and group your GitHub projects
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Your projects
        </h1>
        <p className="text-muted-foreground">
          You have {projects?.length || 0} projects organized in {tags?.length || 0} folders
        </p>
      </div>

      {/* Folders Grid */}
      {filteredTags.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-md text-foreground/70">
           <Folder className="w-4 h-4 inline-block mr-2" /> Folders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map(([tag]: [Tag, Project[]]) => (
              <FolderCard
                key={tag.id}
                tag={tag}
                onSelect={() => onFolderSelect?.(tag.id)}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            📌 Latest Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.slice(0, 12).map((project) => (
              <FileCard
                key={project.id}
                project={project}
                onSelect={onProjectSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
