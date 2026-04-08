
import { Tag } from '@/types'

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
      className="group relative w-full transition-all duration-200"
      style={{
        aspectRatio: '3/2',
      }}
    >
      {/* SVG Container con contenido dentro */}
      <svg
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Defs para clipPath y estilos */}
        <defs>
          {/* ClipPath para la forma de carpeta con outline */}
          <clipPath id={`folderClip-${tag.id}`}>
            <path d="M 20 50 L 60 50 L 70 30 L 280 30 L 280 180 C 280 185 276 190 270 190 L 30 190 C 24 190 20 185 20 180 Z" />
          </clipPath>

          {/* Estilo de texto */}
          <style>
            {`
              .folder-title {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 16px;
                font-weight: 600;
                fill: currentColor;
              }
              .folder-date {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 12px;
                fill: currentColor;
                opacity: 0.6;
              }
            `}
          </style>
        </defs>

        {/* Fondo de la carpeta (outline) */}
        <path
          d="M 20 50 L 60 50 L 70 30 L 280 30 L 280 180 C 280 185 276 190 270 190 L 30 190 C 24 190 20 185 20 180 Z"
          fill="none"
          stroke={isSelected ? '#0052CC' : 'currentColor'}
          strokeWidth="2"
          opacity={isSelected ? 1 : 0.2}
          className="transition-all duration-200 group-hover:opacity-40"
        />

        {/* Ícono de carpeta (pequeño cuadrado redondeado en esquina superior) */}
        <rect
          x="90"
          y="40"
          width="16"
          height="16"
          rx="8"
          fill={tag.color}
        />

        {/* Nombre de la carpeta */}
        <text
          x="120"
          y="55"
          className="folder-title"
          color="#000"
        >
          {tag.name.length > 20 ? tag.name.substring(0, 20) + '...' : tag.name}
        </text>

        {/* Fecha */}
        <text
          x="35"
          y="165"
          className="folder-date"
          color="#666"
        >
          Apr 2, 2023
        </text>
      </svg>

      {/* Right Section - More Button (fuera del SVG) */}
      
    </button>
  )
}
