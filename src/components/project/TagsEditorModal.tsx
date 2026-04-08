import { useState, useEffect } from 'react'
import { useTagManagement, useGithubProjects } from '@/hooks'
import { useTagValidation } from '@/hooks/useTagValidation'
import { Tag } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, AlertCircle } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { TagSearchFilter } from './TagSearchFilter'

interface TagsEditorModalProps {
  projectId: string
  currentTags: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (tagIds: string[]) => void
}

/**
 * Modal para editar tags de un proyecto
 * Permite seleccionar tags existentes, crear nuevos, y validar datos
 */
export const TagsEditorModal = ({
  projectId,
  currentTags,
  open,
  onOpenChange,
  onSave,
}: TagsEditorModalProps) => {
  const { tags: allTags } = useGithubProjects()
  const { createTag, updateProjectTags, isLoading, error } = useTagManagement()
  const { validateTagName, validateColor, validateTagsCount } = useTagValidation()

  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags.map((t) => t.id))
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#0052CC')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [colorError, setColorError] = useState<string | null>(null)

  // Reinicializar estado cuando el modal abre
  useEffect(() => {
    if (open) {
      setSelectedTags(currentTags.map((t) => t.id))
      setNewTagName('')
      setNewTagColor('#0052CC')
      setShowCreateForm(false)
      setNameError(null)
      setColorError(null)
    }
  }, [currentTags, open])

  const handleCreateTag = async () => {
    // Validar nombre
    const nameValidation = validateTagName(newTagName)
    if (!nameValidation.valid) {
      setNameError(nameValidation.error || 'Error en validación')
      return
    }
    setNameError(null)

    // Validar color
    const colorValidation = validateColor(newTagColor)
    if (!colorValidation.valid) {
      setColorError(colorValidation.error || 'Error en validación')
      return
    }
    setColorError(null)

    // Validar cantidad de tags
    const countValidation = validateTagsCount(selectedTags.length + 1, 10)
    if (!countValidation.valid) {
      setNameError(countValidation.error || 'Error en validación')
      return
    }

    // Crear tag
    const createdTag = await createTag(newTagName, newTagColor)
    if (createdTag) {
      setSelectedTags((prev) => [...prev, createdTag.id])
      setNewTagName('')
      setNewTagColor('#0052CC')
      setShowCreateForm(false)
      setNameError(null)
      setColorError(null)
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Tags del Proyecto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filter */}
          {allTags && allTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Tags Disponibles</h3>
              <TagSearchFilter
                tags={allTags}
                selectedTagIds={selectedTags}
                onToggle={toggleTag}
                maxTags={10}
              />
            </div>
          )}

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
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Tag
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
              {/* Name Input */}
              <div>
                <label htmlFor="tag-name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => {
                    setNewTagName(e.target.value)
                    setNameError(null)
                  }}
                  placeholder="ej: Backend API"
                  className="mt-1"
                  autoFocus
                  aria-invalid={!!nameError}
                />
                {nameError && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </p>
                )}
              </div>

              {/* Color Picker */}
              <div>
                <ColorPicker
                  value={newTagColor}
                  onChange={(color) => {
                    setNewTagColor(color)
                    setColorError(null)
                  }}
                  showPresets={true}
                  label="Color"
                />
                {colorError && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {colorError}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isLoading}
                  className="flex-1"
                  type="button"
                >
                  {isLoading ? 'Creando...' : 'Crear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNameError(null)
                    setColorError(null)
                  }}
                  className="flex-1"
                  type="button"
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

          {/* Selected Tags Preview */}
          {selectedTags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} seleccionado{selectedTags.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags
                  ?.filter((tag) => selectedTags.includes(tag.id))
                  .map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                      <button
                        onClick={() => toggleTag(tag.id)}
                        className="ml-1 hover:opacity-70"
                        type="button"
                        aria-label={`Remover tag ${tag.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
