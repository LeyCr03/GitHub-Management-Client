import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Tag } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

interface TagSearchFilterProps {
  tags: Tag[]
  selectedTagIds: string[]
  onToggle: (tagId: string) => void
  maxTags?: number
}

/**
 * Componente para buscar y filtrar tags
 * Permite búsqueda por nombre o tipo, con límite de selecciones
 */
export const TagSearchFilter = ({
  tags,
  selectedTagIds,
  onToggle,
  maxTags = 10,
}: TagSearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar tags por búsqueda - usa useMemo para optimizar
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags

    const query = searchQuery.toLowerCase()
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query) ||
        tag.type.toLowerCase().includes(query)
    )
  }, [tags, searchQuery])

  const selectedCount = selectedTagIds.length
  const isMaxReached = selectedCount >= maxTags

  const handleToggle = (tagId: string) => {
    // Si no está seleccionado y ya llegamos al máximo, no permitir
    if (!selectedTagIds.includes(tagId) && isMaxReached) {
      return
    }
    onToggle(tagId)
  }

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
          aria-label="Buscar tags por nombre o tipo"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            title="Limpiar búsqueda"
            aria-label="Limpiar búsqueda"
            type="button"
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
          filteredTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)
            const canSelect = isSelected || !isMaxReached

            return (
              <button
                key={tag.id}
                onClick={() => handleToggle(tag.id)}
                disabled={!canSelect}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
                title={!canSelect ? 'Máximo de tags alcanzado' : ''}
                aria-label={`${isSelected ? 'Deseleccionar' : 'Seleccionar'} tag ${tag.name}`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tag.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {tag.type}
                    </p>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="flex-shrink-0">
                      ✓
                    </Badge>
                  )}
                </div>
              </button>
            )
          })
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            No se encontraron tags
          </p>
        )}
      </div>
    </div>
  )
}
