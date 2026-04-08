/**
 * Tarjeta de proyecto - Mejorada
 * Issue 06 - Dashboard y FoldersView
 * Issue 11 - Integración con Servidor NestJS
 * Issue 12 - Rediseño UI Moderno
 *
 * Muestra:
 * - Imagen de portada (opcional) con gradiente
 * - Nombre y descripción
 * - Tags con colores
 * - Estadísticas (stars, forks, language)
 * - Botón para ver en GitHub
 * - Efectos hover refinados
 */

import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, GitFork, ExternalLink, MoreVertical } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helper'
import { urlToOwnerRepo } from '@/lib/project-helpers'

interface ProjectCardProps {
  project: Project
  onSelect?: (ownerRepo: string) => void
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const handleSelect = () => {
    try {
      const ownerRepo = urlToOwnerRepo(project.url)
      onSelect?.(ownerRepo)
    } catch (error) {
      console.error('Error al convertir URL a owner/repo:', error)
    }
  }

  return (
    <Card
      className="group relative overflow-hidden h-full flex flex-col
               hover:shadow-xl transition-all duration-300 hover:-translate-y-2
               bg-gradient-to-br from-card to-card/80 border-border/40 hover:border-primary/20
               cursor-pointer"
      onClick={handleSelect}
    >
      {/* Accent bar on top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0
                 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary to-primary/50"
      />

      {/* Cover Image */}
      {project.coverImage && (
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            className="w-full h-full object-cover group-hover:scale-110
                      transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header with more button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-foreground truncate text-sm">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {project.description || 'Sin descripción'}
            </p>
          </div>
          <button
            className="h-6 w-6 rounded p-0 text-muted-foreground opacity-0
                       group-hover:opacity-100 transition-opacity flex-shrink-0
                       hover:bg-muted/40 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats Footer */}
        <div className="flex items-center gap-3 py-3 border-t border-border/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <Star className="w-3 h-3" />
            <span className="font-medium">{abbreviateNumber(project.stats.stars)}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <GitFork className="w-3 h-3" />
            <span className="font-medium">{abbreviateNumber(project.stats.forks)}</span>
          </div>
          {project.stats.language && (
            <span className="px-2 py-0.5 bg-muted rounded text-xs ml-auto">
              {project.stats.language}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          className="mt-3 w-full h-8 rounded-lg bg-primary/10 hover:bg-primary/20
                     text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            window.open(project.url, '_blank')
          }}
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </Card>
  )
}
