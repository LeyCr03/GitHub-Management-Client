/**
 * Tarjeta de proyecto (FileCard) - HTML/Tailwind estilizado
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Card moderna con header de archivo, body con info, footer con acción
 * - Colores dinámicos para tags basados en el hex del tag
 * - Hover effects (lift, accent bar, border glow)
 * - Responsive y compatible con dark mode
 */

import { Project } from '@/types'
import { ExternalLink, FileText, Star, GitFork } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helper'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  const visibilityLabel = project.visibility === 'private' ? 'Private' : 'Public'

  return (
    <button
      onClick={() => onSelect?.(project.url)}
      className="group w-full h-full cursor-pointer"
    >
      <Card className="relative overflow-hidden h-full flex rounded-md flex-col border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-linear-to-br from-card to-card/80">
        <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 bg-linear-to-r from-primary to-primary/50 transition-opacity duration-200" />

        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/20 bg-primary/5">
            <div className="flex items-center gap-1 rounded-full px-2">
              <Star className="w-3 h-3" fill={project.stats.stars > 0 ? 'yellow' : 'gray'}  color={project.stats.stars > 0 ? 'gold' : 'gray'}/>
              <span className="font-medium">
                {abbreviateNumber(project.stats.stars)}
              </span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" fill={project.stats.forks > 0 ? 'green' : 'red'}  color={project.stats.forks > 0 ? 'green' : 'red'} />
            <span className="font-medium">
              {abbreviateNumber(project.stats.forks)}
            </span>
          </div>
          <span className={`px-2 py-0.5 text-xs font-medium ${visibilityLabel === 'Private' ? ' text-green-700' : ' text-primary/90'} rounded`}>
            {visibilityLabel}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col gap-4 mt-3">
          {/* Title and description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground truncate">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {project.description || 'No description'}
            </p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex justify-center items-center gap-2">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    backgroundColor: tag.color + '20',
                    color: tag.color,
                    borderColor: tag.color + '40',
                  }}
                >
                  {tag.name.length > 12 ? tag.name.substring(0, 12) : tag.name}
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
          <div className="flex-1 border-t-2 border-primary/10" />
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center gap-1.5 transition-colors duration-200"
            onClick={handleViewOnGithub}
          >
            <span className="text-xs font-medium">View on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </button>
  )
}
