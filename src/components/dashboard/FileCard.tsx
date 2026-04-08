/**
 * Tarjeta de proyecto (FileCard) - SVG File con contenido dentro
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Card completa como SVG outline (document/file shape)
 * - Contenido (nombre, descripción, stats) dentro del SVG
 * - Ícono de archivo en la esquina superior
 * - Diseño elegante y minimalista
 */

import { Project } from '@/types'
import { ExternalLink } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helper'
import { Button } from '@/components/ui/button'

interface FileCardProps {
  project: Project
  onSelect?: (ownerRepo: string) => void
}

export const FileCard = ({ project, onSelect }: FileCardProps) => {
  const handleViewOnGithub = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(project.url, '_blank')
  }

  return (
    <button
      onClick={() => onSelect?.(project.url)}
      className="group relative w-full transition-all duration-200 hover:opacity-80"
      style={{
        aspectRatio: '3/4',
      }}
    >
      {/* SVG File Container con contenido dentro */}
      <svg
        viewBox="0 0 280 380"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Defs para estilos */}
        <defs>
          <style>
            {`
              .file-title {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 14px;
                font-weight: 600;
                fill: currentColor;
              }
              .file-description {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 11px;
                fill: currentColor;
                opacity: 0.7;
              }
              .file-stat {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 10px;
                fill: currentColor;
                opacity: 0.6;
              }
            `}
          </style>
        </defs>

        {/* Fondo del archivo (outline document shape) */}
        <path
          d="M 30 20 L 30 360 C 30 370 38 378 48 378 L 250 378 C 260 378 268 370 268 360 L 268 80 L 180 80 C 170 80 162 72 162 62 L 162 20 C 162 20 30 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.2"
          className="transition-all duration-200 group-hover:opacity-40"
        />

        {/* Ícono/Header del archivo (pequeño cuadrado coloreado) */}
        <rect
          x="25"
          y="15"
          width="20"
          height="20"
          rx="3"
          fill={project.stats.language === 'TypeScript' ? '#3178C6' : '#F7DF1E'}
        />

        {/* Nombre del proyecto */}
        <text
          x="25"
          y="70"
          className="file-title"
        >
          {project.name.length > 25 ? project.name.substring(0, 25) + '...' : project.name}
        </text>

        {/* Descripción */}
        <text
          x="25"
          y="95"
          className="file-description"
        >
          {project.description && project.description.length > 35
            ? project.description.substring(0, 35) + '...'
            : project.description || 'No description'}
        </text>

        {/* Línea separadora */}
        <line
          x1="25"
          y1="110"
          x2="255"
          y2="110"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.15"
        />

        {/* Tags */}
        {project.tags.slice(0, 2).map((tag, index) => (
          <g key={tag.id}>
            {/* Tag background */}
            <rect
              x={25 + index * 90}
              y="125"
              width="80"
              height="18"
              rx="4"
              fill={tag.color}
              opacity="0.15"
            />
            {/* Tag text */}
            <text
              x={30 + index * 90}
              y="137"
              className="file-stat"
              fill={tag.color}
            >
              {tag.name.length > 10 ? tag.name.substring(0, 10) : tag.name}
            </text>
          </g>
        ))}

        {/* Stats Section */}
        {/* Stars */}
        <text x="25" y="170" className="file-stat">
          ⭐ {abbreviateNumber(project.stats.stars)}
        </text>

        {/* Forks */}
        <text x="95" y="170" className="file-stat">
          🔀 {abbreviateNumber(project.stats.forks)}
        </text>

        {/* Language */}
        {project.stats.language && (
          <text x="165" y="170" className="file-stat">
            {project.stats.language}
          </text>
        )}

        {/* Footer info */}
        <text x="25" y="200" className="file-description">
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </text>
      </svg>

      {/* View Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-3 right-3 h-6 w-6 p-0 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-muted/40"
        onClick={handleViewOnGithub}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </Button>
    </button>
  )
}
