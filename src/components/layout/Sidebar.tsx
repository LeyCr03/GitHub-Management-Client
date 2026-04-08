/**
 * Barra lateral del dashboard
 * Issue 05 - Componentes de Layout
 *
 * Muestra:
 * - Logo/título
 * - Botón "Todos los proyectos"
 * - Lista de tags (carpetas)
 * - Botón para crear nuevo tag
 */

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

  if (isLoading) {
    return (
      <aside className="w-64 bg-sidebar border-r border-border p-4">
        <div className="text-muted-foreground">Cargando tags...</div>
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

        {tags && tags.length > 0 ? (
          <>
            {tags.map((tag: Tag) => (
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
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 text-left text-sm truncate">{tag.name}</span>
                <span className="text-xs bg-background/20 px-2 py-0.5 rounded">
                  {/* Count de proyectos */}
                </span>
              </button>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground px-2">
            No hay tags aún
          </p>
        )}

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
