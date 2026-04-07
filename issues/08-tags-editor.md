# Issue 8: Tags Editor y Gestión de Tags

## Objetivo
Implementar modal para crear/editar tags de proyectos.

## Tareas

### 1. Crear TagsEditorModal
**Archivo:** `src/components/project/TagsEditorModal.tsx`

```typescript
import { useState, useEffect } from 'react'
import { useTagManagement, useGithubProjects } from '@/hooks'
import { Tag } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, AlertCircle } from 'lucide-react'

interface TagsEditorModalProps {
  projectId: string
  currentTags: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (tagIds: string[]) => void
}

export const TagsEditorModal = ({
  projectId,
  currentTags,
  open,
  onOpenChange,
  onSave,
}: TagsEditorModalProps) => {
  const { tags: allTags } = useGithubProjects()
  const { createTag, updateProjectTags, isLoading, error } = useTagManagement()

  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags.map((t) => t.id))
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#FF5733')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    setSelectedTags(currentTags.map((t) => t.id))
  }, [currentTags, open])

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    const createdTag = await createTag(newTagName, newTagColor)
    if (createdTag) {
      setSelectedTags((prev) => [...prev, createdTag.id])
      setNewTagName('')
      setNewTagColor('#FF5733')
      setShowCreateForm(false)
    }
  }

  const handleSave = async () => {
    const success = await updateProjectTags(projectId, selectedTags)
    if (success) {
      onSave?.(selectedTags)
      onOpenChange(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tags del Proyecto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Tags */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tags Disponibles</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allTags?.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTags.includes(tag.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tag.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {tag.type}
                      </p>
                    </div>
                    {selectedTags.includes(tag.id) && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Seleccionado
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">O crear uno nuevo</span>
            </div>
          </div>

          {/* Create New Tag */}
          {!showCreateForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Tag
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="ej: API REST"
                  className="mt-1"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    placeholder="#FF5733"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isLoading}
                  className="flex-1"
                >
                  Crear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 2. Agregar botón de edición de tags en ProjectDetailModal
**Archivo:** `src/components/project/ProjectDetailModal.tsx`

Actualizar el header para incluir botón de edición:

```typescript
import { useState } from 'react'
import { TagsEditorModal } from './TagsEditorModal'
import { Pencil } from 'lucide-react'

export const ProjectDetailModal = ({ ... }: ProjectDetailModalProps) => {
  const { project, isLoading, mutate } = useProjectDetail(projectId || '')
  const [tagsEditorOpen, setTagsEditorOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          // ...
        ) : project ? (
          <>
            {/* Header con botón de edición */}
            <DialogHeader className="pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">
                    {project.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          style={{
                            backgroundColor: tag.color + '20',
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTagsEditorOpen(true)}
                      className="ml-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar tags
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="default" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver en GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Tags Editor Modal */}
            <TagsEditorModal
              projectId={project.id}
              currentTags={project.tags}
              open={tagsEditorOpen}
              onOpenChange={setTagsEditorOpen}
              onSave={() => {
                mutate() // Revalidar datos del proyecto
              }}
            />

            {/* Tabs ... resto del código */}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
```

### 3. Crear constants para colores de tags
**Archivo:** `src/constants/tag-colors.ts`

```typescript
export const DEFAULT_TAG_COLORS: Record<string, string> = {
  finished: '#10B981',
  'side-project': '#F59E0B',
  'pet-project': '#EC4899',
  learning: '#3B82F6',
  archived: '#6B7280',
}

export const TAG_COLOR_PRESETS = [
  '#FF5733', // Rojo
  '#FFC300', // Amarillo
  '#52B788', // Verde
  '#3A86FF', // Azul
  '#FB5607', // Naranja
  '#D62828', // Rojo oscuro
  '#00B4D8', // Cian
  '#9D4EDD', // Púrpura
  '#FF006E', // Magenta
  '#FFBE0B', // Amarillo brillante
]
```

### 4. Mejorar TagsEditorModal con presets de colores
**Actualización en TagsEditorModal.tsx:**

```typescript
import { TAG_COLOR_PRESETS } from '@/constants/tag-colors'

// Agregar en el form de crear tag:
<div>
  <label className="text-sm font-medium">Color</label>
  <div className="grid grid-cols-5 gap-2 mt-2">
    {TAG_COLOR_PRESETS.map((color) => (
      <button
        key={color}
        onClick={() => setNewTagColor(color)}
        className={`w-8 h-8 rounded-full border-2 transition-all ${
          newTagColor === color ? 'border-foreground scale-110' : 'border-border'
        }`}
        style={{ backgroundColor: color }}
        title={color}
      />
    ))}
  </div>
  <div className="flex gap-2 mt-3">
    <input
      type="color"
      value={newTagColor}
      onChange={(e) => setNewTagColor(e.target.value)}
      className="w-12 h-10 rounded cursor-pointer"
    />
    <Input
      value={newTagColor}
      onChange={(e) => setNewTagColor(e.target.value)}
      placeholder="#FF5733"
      className="flex-1"
    />
  </div>
</div>
```

## Criterios de Aceptación
- ✅ Modal abre correctamente
- ✅ Se pueden seleccionar/deseleccionar tags
- ✅ Se puede crear nuevo tag inline
- ✅ Color picker funciona
- ✅ Guardar cambios actualiza proyecto
- ✅ Error handling implementado
- ✅ Loading states visibles
- ✅ Cambios se reflejan en UI inmediatamente

## Notas Importantes
- Los cambios en tags deben invalidar el cache de SWR
- Validar que el nombre del tag no esté vacío
- Validar que el color sea un hex válido
- Limitar la cantidad de tags por proyecto (ej: máximo 5)
