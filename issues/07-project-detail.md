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

### 6. Crear TagsEditorModal (IMPORTANTE)

**Archivo:** `src/components/project/TagsEditorModal.tsx`

```typescript
import { useState } from 'react'
import { useTagManagement } from '@/hooks'
import { Tag } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TAG_COLOR_PRESETS } from '@/constants/tag-colors'
import { X } from 'lucide-react'

interface TagsEditorModalProps {
  projectId: string
  currentTags: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (tags: Tag[]) => void
}

export const TagsEditorModal = ({
  projectId,
  currentTags,
  open,
  onOpenChange,
  onSave,
}: TagsEditorModalProps) => {
  const { createTag, updateProjectTags, isLoading, error } = useTagManagement()
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentTags.map((t) => t.id)
  )
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#0052CC')

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    const createdTag = await createTag(newTagName, newTagColor)
    if (createdTag) {
      setSelectedTags((prev) => [...prev, createdTag.id])
      setNewTagName('')
      setNewTagColor('#0052CC')
      setShowCreateForm(false)
    }
  }

  const handleSave = async () => {
    const success = await updateProjectTags(projectId, selectedTags)
    if (success) {
      onSave?.(currentTags.filter((t) => selectedTags.includes(t.id)))
      onOpenChange(false)
    }
  }

  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tags del Proyecto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tags disponibles */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Tags Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleToggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full border-2 transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id)
                      ? tag.color + '20'
                      : 'transparent',
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Crear nuevo tag */}
          {showCreateForm && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <Input
                placeholder="Nombre del tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />

              <div>
                <label className="text-xs font-medium">Color</label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {TAG_COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newTagColor === color ? 'border-foreground scale-125' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isLoading}
                >
                  Crear Tag
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewTagName('')
                    setNewTagColor('#0052CC')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {!showCreateForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              + Crear nuevo tag
            </Button>
          )}

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 7. Crear Skeleton Loaders (OPCIONAL pero recomendado)

**Archivo:** `src/components/project/ProjectDetailSkeleton.tsx`

```typescript
export const ProjectDetailSkeleton = () => {
  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
        <div className="h-10 bg-muted rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="h-10 bg-muted rounded-lg w-full animate-pulse" />

      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-muted rounded-lg w-5/6 animate-pulse" />
        <div className="h-4 bg-muted rounded-lg w-4/5 animate-pulse" />
      </div>
    </div>
  )
}
```

### 8. Actualizar ProjectCard para abrir modal

**En archivo:** `src/components/dashboard/ProjectCard.tsx`

Actualizar el componente para integrar el modal:

```typescript
import { useState } from 'react'
import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectDetailModal } from '@/components/project/ProjectDetailModal'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { abbreviateNumber } from '@/lib/helpers'

interface ProjectCardProps {
  project: Project
  onSelect?: (projectId: string) => void
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <>
      <Card
        className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => {
          setDetailOpen(true)
          onSelect?.(project.id)
        }}
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
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline">+{project.tags.length - 3}</Badge>
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

          {/* Action */}
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

      {/* Detail Modal */}
      <ProjectDetailModal
        projectId={project.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
```

## Estructura de Archivos a Crear

```
src/components/project/
├── ProjectDetailModal.tsx         ← Modal principal
├── ReadmePreview.tsx              ← Preview de README
├── CommitsList.tsx                ← Lista de commits
├── ImageGallery.tsx               ← Galería de imágenes
├── ProjectMetadata.tsx            ← Metadata del proyecto
├── TagsEditorModal.tsx            ← Modal para editar tags
├── ProjectDetailSkeleton.tsx      ← Skeleton loader (opcional)
└── index.ts                       ← Exportar componentes
```

**Crear archivo índice:** `src/components/project/index.ts`

```typescript
export { ProjectDetailModal } from './ProjectDetailModal'
export { ReadmePreview } from './ReadmePreview'
export { CommitsList } from './CommitsList'
export { ImageGallery } from './ImageGallery'
export { ProjectMetadata } from './ProjectMetadata'
export { TagsEditorModal } from './TagsEditorModal'
export { ProjectDetailSkeleton } from './ProjectDetailSkeleton'
```

---

## 🧪 Testing Guide

### Test 1: Modal Abre

```typescript
// En tu componente de test
import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'

test('modal abre al hacer click en proyecto', async () => {
  const project = { /* ... */ }
  render(<ProjectCard project={project} />)
  
  fireEvent.click(screen.getByText(project.name))
  
  expect(screen.getByText('Ver en GitHub')).toBeInTheDocument()
})
```

### Test 2: README Carga

```typescript
test('README se renderiza correctamente', async () => {
  const { getByText } = render(
    <ReadmePreview projectId="test-project" />
  )
  
  // Esperar contenido de README
  await waitFor(() => {
    expect(getByText(/content/i)).toBeInTheDocument()
  })
})
```

### Test 3: Commits se Muestran

```typescript
test('commits se cargan y muestran', async () => {
  const { getByText } = render(
    <CommitsList projectId="test-project" limit={5} />
  )
  
  await waitFor(() => {
    expect(getByText(/commit message/i)).toBeInTheDocument()
  })
})
```

### Test 4: Galería Funciona

```typescript
test('galería navega entre imágenes', async () => {
  const images = [
    { url: 'img1.jpg', alt: 'Img 1', name: 'img1' },
    { url: 'img2.jpg', alt: 'Img 2', name: 'img2' },
  ]
  
  const { getByText, getByAltText } = render(
    <ImageGallery images={images} />
  )
  
  fireEvent.click(getByText(/next/i))
  expect(getByAltText('Img 2')).toBeInTheDocument()
})
```

---

## 📊 Flujo de Datos

```
ProjectCard (click)
    ↓
ProjectDetailModal (projectId)
    ↓
    ├→ useProjectDetail → GET /api/projects/:owner/:repo
    │
    ├→ Tabs (defaultValue: "readme")
    │   ├→ ReadmePreview → useReadmeContent → GET /readme
    │   ├→ CommitsList → useProjectCommits → GET /commits
    │   ├→ ImageGallery → project.images array
    │   └→ ProjectMetadata → project data
    │
    └→ TagsEditorModal → updateProjectTags → PATCH /tags
```

---

## 🎨 Notas de Diseño

### Responsive Design

```
Mobile (< 640px):
- Modal max-w-full
- Grid columns: 1
- Tabs horizontal scroll

Tablet (640px - 1024px):
- Modal max-w-2xl
- Grid columns: 2
- Tabs standard

Desktop (> 1024px):
- Modal max-w-4xl
- Grid columns: 4
- Tabs standard
```

### Loading States

```typescript
// Mostrar skeleton mientras carga
<ProjectDetailSkeleton />

// O indicador de carga simple
<div className="animate-pulse">Cargando...</div>
```

### Error Handling

```typescript
// Mostrar mensaje de error
{isError && (
  <Alert type="error">
    No se pudo cargar el proyecto
  </Alert>
)}

// Para componentes individuales
{!content && !isLoading && (
  <div className="text-center text-muted-foreground">
    No hay contenido disponible
  </div>
)}
```

---

## 🔑 Características Clave

### 1. Lazy Loading de Imágenes

```typescript
<img
  src={url}
  alt={alt}
  loading="lazy"  // ← Carga cuando entra en viewport
  className="w-full h-full object-cover"
/>
```

### 2. Markdown Seguro

```typescript
<Markdown
  options={{
    overrides: {
      // Sanitizar elementos
      script: () => null,
      iframe: () => null,
    },
  }}
>
  {content}
</Markdown>
```

### 3. Optimización de Rendimiento

```typescript
// SWR con deduping
const { data } = useSWR(
  projectId ? ['project', projectId] : null,
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutos
  }
)
```

---

## 📝 Mejores Prácticas

1. **Manejo de null/undefined:**
   - Siempre verificar `project` antes de acceder propiedades
   - Mostrar "No disponible" si falta información

2. **Performance:**
   - Lazy load imágenes
   - Memoizar componentes complejos
   - Evitar re-renders innecesarios

3. **UX:**
   - Loading states visibles
   - Error messages claros
   - Transiciones suaves

4. **Accesibilidad:**
   - Alt text en imágenes
   - ARIA labels donde corresponda
   - Soporte keyboard navigation

5. **Seguridad:**
   - Sanitizar markdown
   - Validar URLs externas
   - No ejecutar scripts en contenido dinámico

---

## Criterios de Aceptación
- ✅ Modal abre al hacer click en proyecto
- ✅ Tabs funcionan correctamente
- ✅ README se renderiza con markdown
- ✅ Commits se muestran en lista
- ✅ Galería de imágenes funciona con navegación
- ✅ Metadata muestra todos los datos
- ✅ TagsEditorModal integrado y funcional
- ✅ Links abren en nueva pestaña
- ✅ Responsive en devices
- ✅ Loading states y error handling
- ✅ SWR cache funcionando
- ✅ Sin console errors o warnings

## Notas
- README debe soportar syntax highlighting (próximo step)
- Las imágenes deben ser lazy loaded
- El markdown debe sanitizarse para seguridad

## 🔌 Integración Completa en App.tsx

```typescript
import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'
import { ProjectDetailModal } from '@/components/project/ProjectDetailModal'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  return (
    <MainLayout>
      <FoldersView
        onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId)
          setDetailModalOpen(true)
        }}
      />

      <ProjectDetailModal
        projectId={selectedProjectId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </MainLayout>
  )
}

export default App
```

---

## 📊 Resumen Ejecutivo

### Componentes Creados

| Componente | Responsabilidad | Líneas |
|-----------|-----------------|--------|
| ProjectDetailModal | Orquestador principal | ~125 |
| ReadmePreview | Renderizar markdown | ~50 |
| CommitsList | Listar commits | ~65 |
| ImageGallery | Galería con navegación | ~90 |
| ProjectMetadata | Stats y metadata | ~85 |
| TagsEditorModal | Editor de tags | ~150 |
| ProjectDetailSkeleton | Loading state | ~35 |

**Total: ~600 líneas de código**

### Tiempo por Tarea

```
1. ProjectDetailModal    : 30 min
2. ReadmePreview        : 20 min
3. CommitsList          : 20 min
4. ImageGallery         : 25 min
5. ProjectMetadata      : 20 min
6. TagsEditorModal      : 30 min
7. Skeleton + Index     : 10 min
8. Testing & Polish     : 15 min

TOTAL: 170 minutos ≈ 2.8 horas ✅
```

---

## ⚠️ Nota Importante para Integración Servidor (Issue 11)

Este componente será **actualizado en el Issue 11** para recibir y usar `owner/repo` en lugar de `projectId`.

**Cambios que se harán en Issue 11:**
- Cambiar props de `projectId` a `ownerRepo` (formato owner/repo)
- Actualizar llamadas a hooks para usar nuevo formato
- Validar formato `owner/repo` antes de hacer requests

Ahora implementa el componente tal como está especificado. Los ajustes finales se harán en Issue 11.

---

## 🎓 Aprendizajes Clave

### 1. Composición de Componentes
Este issue demuestra cómo componer múltiples componentes pequeños en uno grande:
- Modal principal orquesta a los demás
- Cada sub-componente tiene responsabilidad clara
- Comunicación via props

### 2. Manejo de Datos Externos
- Usar hooks para fetch de datos
- Manejar estados: loading, error, data
- Caché con SWR para optimización

### 3. UX Patterns
- Tabs para organizar contenido
- Modal para información detallada
- Loading states y error messages
- Lazy loading de imágenes

---

## 📚 Referencias

**Documentación relacionada:**
- Issue 04: Hooks Personalizados (useProjectDetail, etc)
- Issue 09: Componentes UI (Dialog, Tabs, Badge)
- Issue 10: Error handling y validaciones

**Librerías usadas:**
- `react-markdown` - Renderizar markdown
- `markdown-to-jsx` - Markdown a JSX
- `lucide-react` - Iconos
