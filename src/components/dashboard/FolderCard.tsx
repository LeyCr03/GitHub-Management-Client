/**
 * Tarjeta de carpeta (FolderCard) - Estilo TaskFlow
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Diseño limpio y minimalista
 * - Ícono de color en esquina superior
 * - Nombre y contador en el medio
 * - Fecha y botón más en la parte inferior
 * - Efecto hover suave
 */

import { Tag } from '@/types'
import { MoreVertical, Folder } from 'lucide-react'
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
      className={`group relative overflow-hidden rounded-xl p-5 min-h-[140px]
                  transition-all duration-300 text-left
                  flex flex-col justify-between
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-md'
                      : 'bg-card/50 border border-border/30 hover:border-border/50 hover:shadow-lg hover:bg-card'
                  }
                  backdrop-blur-sm`}
    >
      {/* Top Section - Icon + Title */}
      <div className="space-y-3">
        {/* Icon in colored square */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center
                     group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
          style={{ backgroundColor: tag.color }}
        >
          <Folder className="w-5 h-5 text-white" />
        </div>

        {/* Title and Count */}
        <div>
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {tag.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Bottom Section - Date + More Button */}
      <div className="flex items-center justify-between pt-3 border-t border-border/10 mt-2">
        <span className="text-xs text-muted-foreground">Apr 2, 2025</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/40"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Subtle background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${tag.color}, ${tag.color}99)`,
        }}
      />
    </button>
  )
}
