/**
 * Tarjeta de carpeta (FolderCard) - Estilo TaskFlow Minimalista
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Layout horizontal limpio
 * - SVG folder icon con clipPath (forma realista de carpeta)
 * - Nombre de carpeta junto al ícono
 * - Fecha debajo del título
 * - Botón más arriba a la derecha
 * - Diseño muy minimalista
 */

import { Tag } from '@/types'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FolderCardProps {
  tag: Tag
  onSelect: () => void
  isSelected: boolean
}

/**
 * SVG Folder Icon con clipPath
 * Simula la forma realista de una carpeta
 */
const FolderIcon = ({ color }: { color: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    {/* ClipPath para crear la forma de carpeta */}
    <defs>
      <clipPath id="folderClip">
        {/* Forma de carpeta: tabs superior izquierdo + rectángulo principal */}
        <path d="M 4 8 L 10 8 L 12 6 L 28 6 L 28 24 C 28 25.1 27.1 26 26 26 L 4 26 C 2.9 26 2 25.1 2 24 L 2 10 C 2 8.9 2.9 8 4 8 Z" />
      </clipPath>
    </defs>

    {/* Fondo de la carpeta con clipPath */}
    <rect
      x="2"
      y="6"
      width="26"
      height="20"
      fill={color}
      clipPath="url(#folderClip)"
    />

    {/* Tab de la carpeta (parte superior izquierda) */}
    <path
      d="M 4 8 L 10 8 L 12 6 L 12 8 L 10 8 L 4 8"
      fill={color}
      opacity="0.8"
    />
  </svg>
)

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
                      ? 'bg-muted/40 border border-primary/30'
                      : 'bg-background/40 border border-border/30 hover:bg-muted/30 hover:border-border/50'
                  }`}
    >
      {/* Left Section - Folder Icon + Title + Date */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* SVG Folder Icon */}
        <FolderIcon color={tag.color} />

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
        className="h-5 w-5 p-0 ml-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-muted/40"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>
    </button>
  )
}
