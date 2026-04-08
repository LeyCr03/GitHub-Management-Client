/**
 * Barra lateral del dashboard - Mejorada
 * Issue 05 - Componentes de Layout
 * Issue 12 - Rediseño UI Moderno
 *
 * Muestra:
 * - Logo/título con icono
 * - Botón "Todos los proyectos"
 * - Lista de tags (carpetas) con conteos
 * - Botón para crear nuevo tag
 * - Mejor styling y responsive
 */

import { useGithubProjects } from '@/hooks'
import { Tag } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Home, Github, Folder } from 'lucide-react'
import classNames from 'classnames'

interface SidebarProps {
  onTagSelect?: (tagId: string | null) => void
  selectedTagId?: string | null
}

export const Sidebar = ({ onTagSelect, selectedTagId }: SidebarProps) => {
  const { tags, isLoading, projects } = useGithubProjects()

  // Contar proyectos por tag
  const getProjectCountForTag = (tagId: string) => {
    return projects?.filter(p => p.tags.some(t => t.id === tagId)).length || 0
  }

  if (isLoading) {
    return (
      <aside className="w-72 background/50 border-r border-border/40 p-6">
        <div className="text-muted-foreground">Cargando...</div>
      </aside>
    )
  }

  return (
    <aside className="w-72 background/50 border-r border-border/40 p-6 overflow-y-auto">
      {/* Logo/Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Github className="w-5 h-5 text-primary-foreground mt-1" />
          </div>
          <div className='flex-col items-center justify-center gap-0.5'>
            <h1 className="text-xl font-bold text-foreground">GitHub Projects</h1>
            <p className="text-xs text-muted-foreground">Gestiona tus repositorios</p>

          </div>
        </div>
      </div>

      {/* Overview Button */}
      <div className="mb-8">
        <Button
          variant={'outline'}
          className="w-full justify-start gap-2"
          onClick={() => onTagSelect?.(null)}
        >
          <Home className="w-4 h-4" />
          <span className='uppercase'>Home</span>
          {projects && (
            <span className="ml-auto text-white text-xs bg-muted px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          )}
        </Button>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase flex px-4">
         <Folder className='w-4 h-4 mr-2'/>Folders
        </h3>


        {tags && tags.length > 0 ? (
          <div className="space-y-2">
            {tags.map((tag: Tag) => {
              const projectCount = getProjectCountForTag(tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={() => onTagSelect?.(tag.id)}
                  className={classNames(
                    'w-full px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group',
                    selectedTagId === tag.id
                      ? 'bg-primary/15 border border-primary/30 text-foreground'
                      : 'hover:bg-muted/40 text-foreground border border-border/20'
                  )}
                >
                  {/* Color dot */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: tag.color }}
                  />

                  {/* Name */}
                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {tag.name}
                  </span>

                  {/* Count */}
                  <span className="text-xs bg-muted/60 px-2 py-1 rounded-full text-muted-foreground
                                group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {projectCount}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground px-2 py-4 text-center">
            No hay tags aún
          </p>
        )}

        
      </div>

      {/* Total stats */}
      <div className="absolute bottom-3 w-60 left-4 mb-5 pt-6 border-t border-border/20 space-y-2">
        <Button
          variant="default"
          className="w-full flex justify-center items-center gap-3 rounded-full"
        >
          <span className="">Crear nuevo tag</span> 
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  )
}
