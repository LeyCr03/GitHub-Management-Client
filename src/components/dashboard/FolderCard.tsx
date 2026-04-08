/**
 * Tarjeta mejorada para mostrar carpetas/tags
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Iconos grandes y coloridos
 * - Contador de proyectos
 * - Efectos hover refinados
 * - Gradient background opcional
 */

import { Tag } from '@/types'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FolderCardProps {
  tag: Tag
  projectCount: number
  onSelect: () => void
  isSelected: boolean
}

export const FolderCard = ({
  tag,
  projectCount,
  onSelect,
  isSelected,
}: FolderCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-xl p-6
                  transition-all duration-300 text-left
                  ${isSelected
        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40 shadow-md'
        : 'bg-card hover:bg-muted/40 border-border/40 hover:shadow-lg'
        }
                  border hover:-translate-y-1`}
    >
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${tag.color}, ${tag.color}99)`,
        }}
      />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Icon Circle */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center
                     text-2xl group-hover:scale-110 transition-transform duration-300
                     font-bold"
          style={{ backgroundColor: `${tag.color}15` }}
        >
          📁
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors">
            {tag.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Meta & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          <span className="text-xs text-muted-foreground">Apr 2, 2025</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </button>
  )
}
