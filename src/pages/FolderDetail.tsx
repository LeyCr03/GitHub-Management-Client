/**
 * Página de detalle de carpeta
 * Issue 12 - Rediseño UI Moderno
 *
 * Muestra todos los proyectos de una carpeta específica
 * en un grid con diseño FileCard
 */

import { useMemo } from 'react'
import { useGithubProjects } from '@/hooks'
import { FileCard } from '@/components/dashboard/FileCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, FolderOpen } from 'lucide-react'

interface FolderDetailPageProps {
  folderId: string
  onBack: () => void
}

export const FolderDetailPage = ({ folderId, onBack }: FolderDetailPageProps) => {
  const { projects, tags, isLoading } = useGithubProjects()

  // Encontrar la carpeta/tag
  const folder = useMemo(() => {
    return tags?.find((tag) => tag.id === folderId)
  }, [tags, folderId])

  // Filtrar proyectos de esta carpeta
  const folderProjects = useMemo(() => {
    if (!projects || !folder) return []
    return projects.filter((p) => p.tags.some((t) => t.id === folder.id))
  }, [projects, folder])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">Folder not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 hover:bg-muted/40"
              onClick={onBack}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: folder.color }}
            >
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{folder.name}</h1>
          </div>
          <p className="text-muted-foreground ml-11">
            {folderProjects.length} project{folderProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {folderProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folderProjects.map((project) => (
            <FileCard
              key={project.id}
              project={project}
              onSelect={() => {
                // Aquí se podría navegar a detalles del proyecto
                window.open(project.url, '_blank')
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">No projects</h2>
          <p className="text-muted-foreground">
            This folder doesn't have any projects yet
          </p>
        </div>
      )}
    </div>
  )
}
