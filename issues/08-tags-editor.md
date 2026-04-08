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

### 5. Crear Custom Hook para Validación de Tags

**Archivo:** `src/hooks/useTagValidation.ts`

```typescript
/**
 * Hook para validación de tags
 */
export const useTagValidation = () => {
  const validateTagName = (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
      return { valid: false, error: 'El nombre del tag no puede estar vacío' }
    }

    if (name.length > 50) {
      return { valid: false, error: 'El nombre debe tener máximo 50 caracteres' }
    }

    if (name.length < 2) {
      return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' }
    }

    // Permitir letras, números, guiones y espacios
    if (!/^[a-zA-Z0-9\s\-]+$/.test(name)) {
      return { valid: false, error: 'Solo se permiten letras, números, guiones y espacios' }
    }

    return { valid: true }
  }

  const validateColor = (color: string): { valid: boolean; error?: string } => {
    const hexRegex = /^#[0-9A-F]{6}$/i
    if (!hexRegex.test(color)) {
      return { valid: false, error: 'El color debe ser un código hex válido (ej: #FF5733)' }
    }
    return { valid: true }
  }

  const validateTagsCount = (count: number, max: number = 10): { valid: boolean; error?: string } => {
    if (count > max) {
      return { valid: false, error: `Máximo ${max} tags por proyecto` }
    }
    return { valid: true }
  }

  return {
    validateTagName,
    validateColor,
    validateTagsCount,
  }
}
```

### 6. Crear Color Picker Component Avanzado

**Archivo:** `src/components/project/ColorPicker.tsx`

```typescript
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { TAG_COLOR_PALETTE } from '@/constants/color-palette'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  showPresets?: boolean
}

export const ColorPicker = ({ value, onChange, showPresets = true }: ColorPickerProps) => {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="space-y-3">
      {/* Color Preview y Input */}
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer border border-border"
          title="Selector de color nativo"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FF5733"
          className="flex-1 font-mono"
          title="Ingresa código hex (ej: #FF5733)"
        />
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="space-y-2">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs text-primary hover:underline"
          >
            {showCustom ? '← Ocultar' : 'Ver'} presets
          </button>

          {showCustom && (
            <div className="grid grid-cols-6 gap-2">
              {TAG_COLOR_PALETTE.custom.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color)
                    setShowCustom(false)
                  }}
                  className={`h-8 rounded border-2 transition-all hover:scale-110 ${
                    value === color ? 'border-foreground' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 7. Crear TagsEditorModal Mejorado con Validación

**Actualizar:** `src/components/project/TagsEditorModal.tsx`

Reemplazar el form de crear tag con validación completa:

```typescript
import { useTagValidation } from '@/hooks/useTagValidation'
import { ColorPicker } from './ColorPicker'

// En el componente:
const { validateTagName, validateColor, validateTagsCount } = useTagValidation()
const [nameError, setNameError] = useState<string | null>(null)
const [colorError, setColorError] = useState<string | null>(null)

const handleCreateTag = async () => {
  // Validar nombre
  const nameValidation = validateTagName(newTagName)
  if (!nameValidation.valid) {
    setNameError(nameValidation.error)
    return
  }

  // Validar color
  const colorValidation = validateColor(newTagColor)
  if (!colorValidation.valid) {
    setColorError(colorValidation.error)
    return
  }

  // Validar cantidad de tags
  const countValidation = validateTagsCount(selectedTags.length + 1, 10)
  if (!countValidation.valid) {
    setError(countValidation.error)
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

// En el JSX:
{showCreateForm && (
  <div className="space-y-3 p-4 bg-muted rounded-lg">
    <div>
      <label className="text-sm font-medium">Nombre</label>
      <Input
        value={newTagName}
        onChange={(e) => {
          setNewTagName(e.target.value)
          setNameError(null)
        }}
        placeholder="ej: Backend API"
        className="mt-1"
        autoFocus
      />
      {nameError && (
        <p className="text-xs text-destructive mt-1">{nameError}</p>
      )}
    </div>

    <div>
      <label className="text-sm font-medium">Color</label>
      <ColorPicker
        value={newTagColor}
        onChange={(color) => {
          setNewTagColor(color)
          setColorError(null)
        }}
      />
      {colorError && (
        <p className="text-xs text-destructive mt-1">{colorError}</p>
      )}
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
        onClick={() => {
          setShowCreateForm(false)
          setNameError(null)
          setColorError(null)
        }}
        className="flex-1"
      >
        Cancelar
      </Button>
    </div>
  </div>
)}
```

### 8. Crear TagSearchFilter (AVANZADO)

**Archivo:** `src/components/project/TagSearchFilter.tsx`

```typescript
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Tag } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

interface TagSearchFilterProps {
  tags: Tag[]
  selectedTagIds: string[]
  onToggle: (tagId: string) => void
}

export const TagSearchFilter = ({
  tags,
  selectedTagIds,
  onToggle,
}: TagSearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags

    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tags, searchQuery])

  const selectedCount = selectedTagIds.length
  const maxTags = 10

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tag Count */}
      <div className="text-xs text-muted-foreground">
        {selectedCount} / {maxTags} tags seleccionados
      </div>

      {/* Tags List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                if (!selectedTagIds.includes(tag.id) && selectedCount >= maxTags) {
                  return // No permitir más de maxTags
                }
                onToggle(tag.id)
              }}
              disabled={
                !selectedTagIds.includes(tag.id) && selectedCount >= maxTags
              }
              className={`w-full p-3 rounded-lg border-2 transition-all text-left disabled:opacity-50 ${
                selectedTagIds.includes(tag.id)
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
                  <p className="font-medium text-sm truncate">{tag.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {tag.type}
                  </p>
                </div>
                {selectedTagIds.includes(tag.id) && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    ✓
                  </Badge>
                )}
              </div>
            </button>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            No se encontraron tags
          </p>
        )}
      </div>
    </div>
  )
}
```

---

## 🧪 Testing Guide

### Test 1: Modal Abre y Cierra

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { TagsEditorModal } from './TagsEditorModal'

test('modal abre y cierra correctamente', async () => {
  const mockOnOpenChange = jest.fn()
  const { rerender } = render(
    <TagsEditorModal
      projectId="test"
      currentTags={[]}
      open={false}
      onOpenChange={mockOnOpenChange}
    />
  )

  // Abrir modal
  rerender(
    <TagsEditorModal
      projectId="test"
      currentTags={[]}
      open={true}
      onOpenChange={mockOnOpenChange}
    />
  )

  expect(screen.getByText('Editar Tags del Proyecto')).toBeInTheDocument()

  // Cerrar
  fireEvent.click(screen.getByText('Cancelar'))
  expect(mockOnOpenChange).toHaveBeenCalledWith(false)
})
```

### Test 2: Crear Tag con Validación

```typescript
test('validación al crear tag', async () => {
  const { getByPlaceholderText, getByText } = render(
    <TagsEditorModal
      projectId="test"
      currentTags={[]}
      open={true}
      onOpenChange={jest.fn()}
    />
  )

  // Click en crear tag
  fireEvent.click(getByText('Crear Nuevo Tag'))

  // Intentar crear sin nombre
  fireEvent.click(getByText('Crear'))
  expect(getByText('El nombre del tag no puede estar vacío')).toBeInTheDocument()

  // Ingresar nombre
  const input = getByPlaceholderText('ej: API REST')
  fireEvent.change(input, { target: { value: 'api' } })

  // Crear tag
  fireEvent.click(getByText('Crear'))
  // ... verificar que se creó
})
```

### Test 3: Seleccionar/Deseleccionar Tags

```typescript
test('seleccionar y deseleccionar tags', async () => {
  const tags = [
    { id: '1', name: 'frontend', color: '#0052CC', type: 'custom', createdAt: '', updatedAt: '' },
    { id: '2', name: 'backend', color: '#FF5733', type: 'custom', createdAt: '', updatedAt: '' },
  ]

  const { getByText } = render(
    <TagsEditorModal
      projectId="test"
      currentTags={tags}
      open={true}
      onOpenChange={jest.fn()}
    />
  )

  // Seleccionar
  fireEvent.click(getByText('frontend'))
  expect(getByText('Seleccionado')).toBeInTheDocument()

  // Deseleccionar
  fireEvent.click(getByText('frontend'))
  expect(queryByText('Seleccionado')).not.toBeInTheDocument()
})
```

### Test 4: Guardar Cambios

```typescript
test('guardar cambios actualiza proyecto', async () => {
  const mockOnSave = jest.fn()
  const { getByText } = render(
    <TagsEditorModal
      projectId="test"
      currentTags={[]}
      open={true}
      onOpenChange={jest.fn()}
      onSave={mockOnSave}
    />
  )

  // ... seleccionar tags ...

  fireEvent.click(getByText('Guardar Cambios'))

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalled()
  })
})
```

---

## 📊 Flujo de Datos

```
ProjectDetailModal
    ↓
(Usuario hace click en "Editar tags")
    ↓
TagsEditorModal abre
    ↓
    ├→ useGithubProjects() → GET /api/tags (allTags)
    ├→ Estado: selectedTags
    │
    ├→ Opción 1: Seleccionar tag existente
    │   ↓
    │   toggleTag() → Estado actualizado
    │
    ├→ Opción 2: Crear nuevo tag
    │   ↓
    │   (Form abre)
    │   ↓
    │   validateTagName() → Validar
    │   validateColor() → Validar
    │   ↓
    │   createTag() → POST /api/tags
    │   ↓
    │   Tag agregado a selectedTags
    │
    └→ Guardar
        ↓
        updateProjectTags() → PATCH /api/projects/:owner/:repo/tags
        ↓
        mutate() → Revalidar proyecto
        ↓
        Modal cierra
        ↓
        onSave callback
```

---

## 🎨 Notas de Diseño

### Color Picker

```
Opción 1: Color Picker Nativo
- HTML5 <input type="color">
- Funciona en todos los browsers
- Experiencia nativa del SO

Opción 2: Grid de Presets
- Grid de 6-10 colores comunes
- Click rápido
- Búsqueda visual

Opción 3: Input Hex Manual
- Para usuarios avanzados
- Compatibilidad con diseño
- Validación hex
```

### Validación en Tiempo Real

```typescript
// Validar mientras el usuario escribe
<Input
  onChange={(e) => {
    setNewTagName(e.target.value)
    const validation = validateTagName(e.target.value)
    setNameError(validation.valid ? null : validation.error)
  }}
/>
```

### Search Filter

```
Beneficios:
- Muchos tags → Búsqueda necesaria
- Filtrar por nombre
- Filtrar por tipo
- Experiencia mejorada
```

---

## 🔑 Características Avanzadas

### 1. Debouncing para Búsqueda

```typescript
import { useMemo } from 'react'

// El filtrado usa useMemo con dependencias
const filteredTags = useMemo(() => {
  // Solo calcula cuando searchQuery o tags cambian
  return tags.filter(...)
}, [tags, searchQuery])
```

### 2. Validación Multipaso

```typescript
// 1. Validar nombre
// 2. Validar color
// 3. Validar cantidad
// 4. Crear tag
```

### 3. Error Handling Granular

```typescript
- nameError
- colorError
- error (general)
- isLoading
```

### 4. Límite de Tags

```typescript
// Max 10 tags por proyecto
if (selectedCount >= maxTags) {
  // Deshabilitar botón
}
```

---

## ♿ Accesibilidad

```typescript
// Labels asociados a inputs
<label htmlFor="tag-name">Nombre</label>
<Input id="tag-name" />

// Titles en color picker
<button title="#FF5733" />

// ARIA labels para botones
<button aria-label="Editar tags" />

// Indicadores visuales
{selectedTags.includes(tag.id) && (
  <Badge>✓ Seleccionado</Badge>
)}
```

---

## 📝 Mejores Prácticas

1. **Validación:**
   - Validar nombre (length, caracteres)
   - Validar color (hex válido)
   - Validar cantidad (max 10)

2. **UX:**
   - Error messages claros
   - Loading states visibles
   - Feedback inmediato

3. **Performance:**
   - useMemo para filtros
   - SWR cache validation
   - Evitar renders innecesarios

4. **Seguridad:**
   - Sanitizar input names
   - Validar hex colors
   - No confiar en cliente

5. **Accesibilidad:**
   - Labels en inputs
   - Keyboard navigation
   - ARIA attributes

---

## ⚠️ Nota Importante para Integración Servidor (Issue 11)

Este componente funcionará con el servidor real en el Issue 11.

**Cambios en Issue 11:**
- Los custom tags se crearán en servidor (POST /api/tags)
- Los tags de proyecto se actualizarán en servidor (PATCH /api/projects/owner/repo/tags)
- El componente recibirá `owner/repo` en lugar de `projectId`

La lógica básica ya está implementada. El Issue 11 solo actualizará los endpoints y parámetros.
