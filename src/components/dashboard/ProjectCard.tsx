/**
 * Tarjeta de proyecto
 * Issue 06 - Dashboard y FoldersView
 *
 * Muestra:
 * - Imagen de portada (opcional)
 * - Nombre y descripción
 * - Tags
 * - Estadísticas (stars, forks, language)
 * - Botón para ver en GitHub
 */

import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helper'

interface ProjectCardProps {
  project: Project
  onSelect?: (projectId: string) => void
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onSelect?.(project.id)}
    >
      {/* Cover Image */}
      {project.coverImage && (
        <div className="mb-4 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden">
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Title & Description */}
        <div>
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {project.description || 'Sin descripción'}
          </p>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                  border: `1px solid ${tag.color}40`
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {abbreviateNumber(project.stats.stars)}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            {abbreviateNumber(project.stats.forks)}
          </div>
          {project.stats.language && (
            <span className="px-2 py-1 bg-muted rounded text-xs">
              {project.stats.language}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          asChild
        >
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <span>Ver en GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  )
}
