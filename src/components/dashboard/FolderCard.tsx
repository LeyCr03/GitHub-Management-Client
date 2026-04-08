/**
 * Tarjeta de carpeta (FolderCard) - Estilo TaskFlow Minimalista
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Layout horizontal limpio
 * - Ícono pequeño y redondeado a la izquierda
 * - Nombre de carpeta junto al ícono
 * - Fecha abajo a la izquierda
 * - Botón más arriba a la derecha
 * - Diseño muy minimalista
 */

import { Tag } from '@/types'
import { MoreVertical, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FolderCardProps {
  tag: Tag
  onSelect: () => void
  isSelected: boolean
}

export const FolderCard = ({
  tag,
  onSelect,
  isSelected,
}: FolderCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full px-5 py-4 rounded-lg
                  transition-all duration-200 text-left
                  flex items-start justify-between
                  ${
                    isSelected
                      ? 'bg-muted/40 border border-primary/20'
                      : 'bg-background/40 border border-border/30 hover:bg-muted/30 hover:border-border/50'
                  }`}
    >
      {/* Left Section - Icon + Title + Date */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Icon in colored rounded square */}
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center
                     flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: tag.color }}
        >
          <Folder className="w-4 h-4 text-white" />
        </div>

        {/* Title and Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
            {tag.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            Apr 2, 2023
          </p>
        </div>
      </div>

      {/* Right Section - More Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 ml-2 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-muted/40"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>
    </button>
  )
}
