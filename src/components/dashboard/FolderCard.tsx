/**
 * Tarjeta de carpeta (FolderCard) - Estilo TaskFlow
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Card vertical compacta
 * - Ícono cuadrado redondeado en esquina superior izquierda
 * - Nombre de carpeta junto al ícono (arriba a la derecha)
 * - Fecha abajo a la izquierda
 * - Botón más arriba a la derecha
 * - Diseño limpio y elegante
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
      className={`group relative w-full p-4 rounded-2xl
                  transition-all duration-200 text-left
                  flex flex-col justify-between min-h-[120px]
                  ${
                    isSelected
                      ? 'bg-muted/40 border border-primary/30'
                      : 'bg-background/40 border border-border/30 hover:bg-muted/30 hover:border-border/50'
                  }`}
    >
      {/* Top Section - Icon + Title + More Button */}
      <div className="flex items-start justify-between gap-3 mb-auto">
        {/* Folder Icon - Squared with rounded corners */}
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: tag.color }}
        >
          <Folder className="w-4 h-4 text-white" />
        </div>

        {/* Right Section - Title + More Button */}
        <div className="flex items-start justify-between gap-2 flex-1">
          {/* Title */}
          <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors flex-1">
            {tag.name}
          </h3>

          {/* More Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-muted/40"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Bottom Section - Date */}
      <div className="text-xs text-muted-foreground">
        Apr 2, 2023
      </div>
    </button>
  )
}
