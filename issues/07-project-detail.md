# Issue 7: Vista Detallada del Proyecto (ProjectDetail)

## Objetivo
Crear modal/página que muestre todos los detalles de un proyecto (README, commits, imágenes).

## Tareas

### 1. Crear ProjectDetail Modal
**Archivo:** `src/components/project/ProjectDetailModal.tsx`

```typescript
import { useEffect } from 'react'
import { useProjectDetail } from '@/hooks'
import { ProjectDetail } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReadmePreview } from './ReadmePreview'
import { CommitsList } from './CommitsList'
import { ProjectMetadata } from './ProjectMetadata'
import { ImageGallery } from './ImageGallery'
import { X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectDetailModalProps {
  projectId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProjectDetailModal = ({
  projectId,
  open,
  onOpenChange,
}: ProjectDetailModalProps) => {
  const { project, isLoading } = useProjectDetail(projectId || '')

  if (!projectId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div>Cargando detalles...</div>
          </div>
        ) : project ? (
          <>
            {/* Header */}
            <DialogHeader className="pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">
                    {project.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="default"
                      asChild
                    >
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver en GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Tabs */}
            <Tabs defaultValue="readme" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="readme">README</TabsTrigger>
                <TabsTrigger value="commits">Commits</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="metadata">Info</TabsTrigger>
              </TabsList>

              {/* README Tab */}
              <TabsContent value="readme" className="space-y-4">
                {project.readme ? (
                  <ReadmePreview projectId={project.id} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay README disponible
                  </div>
                )}
              </TabsContent>

              {/* Commits Tab */}
              <TabsContent value="commits" className="space-y-4">
                <CommitsList projectId={project.id} />
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                {project.images.length > 0 ? (
                  <ImageGallery images={project.images} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay imágenes
                  </div>
                )}
              </TabsContent>

              {/* Metadata Tab */}
              <TabsContent value="metadata" className="space-y-4">
                <ProjectMetadata project={project} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div>Proyecto no encontrado</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

### 2. Crear ReadmePreview
**Archivo:** `src/components/project/ReadmePreview.tsx`

```typescript
import { useReadmeContent } from '@/hooks'
import Markdown from 'markdown-to-jsx'
import { Code } from '@/components/ui/code'

interface ReadmePreviewProps {
  projectId: string
}

export const ReadmePreview = ({ projectId }: ReadmePreviewProps) => {
  const { content, isLoading } = useReadmeContent(projectId)

  if (isLoading) {
    return <div>Cargando README...</div>
  }

  if (!content) {
    return <div>No hay README disponible</div>
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <Markdown
        options={{
          overrides: {
            code: {
              component: Code,
            },
            img: {
              props: {
                style: {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                },
                loading: 'lazy',
              },
            },
            a: {
              props: {
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
```

### 3. Crear CommitsList
**Archivo:** `src/components/project/CommitsList.tsx`

```typescript
import { useProjectCommits } from '@/hooks'
import { GitHubCommit } from '@/types'
import { formatDate } from '@/lib/helpers'
import { ExternalLink, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommitsListProps {
  projectId: string
  limit?: number
}

export const CommitsList = ({ projectId, limit = 10 }: CommitsListProps) => {
  const { commits, isLoading } = useProjectCommits(projectId, limit)

  if (isLoading) {
    return <div>Cargando commits...</div>
  }

  if (!commits || commits.length === 0) {
    return <div className="text-muted-foreground">No hay commits disponibles</div>
  }

  return (
    <div className="space-y-3">
      {commits.map((commit: GitHubCommit) => (
        <div
          key={commit.sha}
          className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {commit.message.split('\n')[0]}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{commit.author.name}</span>
                <span>•</span>
                <span>{formatDate(commit.author.date)}</span>
              </div>
              {commit.message.split('\n').length > 1 && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {commit.message.split('\n').slice(1).join('\n')}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href={commit.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 4. Crear ImageGallery
**Archivo:** `src/components/project/ImageGallery.tsx`

```typescript
import { useState } from 'react'
import { ProjectImage } from '@/types'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageGalleryProps {
  images: ProjectImage[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  if (!images || images.length === 0) {
    return <div>No hay imágenes</div>
  }

  const currentImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover"
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/75"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/75"
              onClick={goToNext}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/75 text-sm rounded">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? 'border-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 5. Crear ProjectMetadata
**Archivo:** `src/components/project/ProjectMetadata.tsx`

```typescript
import { ProjectDetail } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatDate, abbreviateNumber } from '@/lib/helpers'
import { Star, GitFork, AlertCircle, Users, Globe } from 'lucide-react'

interface ProjectMetadataProps {
  project: ProjectDetail
}

export const ProjectMetadata = ({ project }: ProjectMetadataProps) => {
  return (
    <div className="space-y-6">
      {/* Tags */}
      {project.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xs">Estrellas</span>
          </div>
          <p className="text-lg font-semibold">
            {abbreviateNumber(project.stats.stars)}
          </p>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <GitFork className="w-4 h-4" />
            <span className="text-xs">Forks</span>
          </div>
          <p className="text-lg font-semibold">
            {abbreviateNumber(project.stats.forks)}
          </p>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">Issues Abiertos</span>
          </div>
          <p className="text-lg font-semibold">
            {abbreviateNumber(project.stats.openIssues)}
          </p>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Contributors</span>
          </div>
          <p className="text-lg font-semibold">{project.contributors}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lenguaje:</span>
          <span className="font-medium">{project.stats.language || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rama por defecto:</span>
          <span className="font-medium">{project.defaultBranch}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Visibility:</span>
          <span className="font-medium capitalize">{project.visibility}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Última actualización:</span>
          <span className="font-medium">{formatDate(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
```

### 6. Actualizar ProjectCard para abrir modal
```typescript
// En ProjectCard.tsx, actualizar onSelect
import { useState } from 'react'
import { ProjectDetailModal } from './ProjectDetailModal'

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <>
      <Card
        className="p-4 cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        {/* ... card content ... */}
      </Card>
      <ProjectDetailModal
        projectId={project.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
```

## Criterios de Aceptación
- ✅ Modal abre al hacer click en proyecto
- ✅ Tabs funcionan correctamente
- ✅ README se renderiza con markdown
- ✅ Commits se muestran en lista
- ✅ Galería de imágenes funciona con navegación
- ✅ Metadata muestra todos los datos
- ✅ Links abren en nueva pestaña
- ✅ Responsive en devices

## Notas
- README debe soportar syntax highlighting (próximo paso)
- Las imágenes deben ser lazy loaded
- El markdown debe sanitizarse para seguridad
