/**
 * Hook para gestionar tags
 * Issue 04 - Hooks Personalizados
 *
 * Acciones:
 * - Crear nuevos tags
 * - Actualizar tags de proyectos
 * - Eliminar tags
 */

import { useState } from 'react'
import { api } from '@/lib/api'
import { Tag } from '@/types'

interface UseTagManagementReturn {
  isLoading: boolean
  error: string | null
  createTag: (name: string, color: string) => Promise<Tag | null>
  updateProjectTags: (projectId: string, tagIds: string[]) => Promise<boolean>
  deleteTag: (tagId: string) => Promise<boolean>
}

/**
 * Hook para gestionar operaciones de tags
 * Maneja crear, actualizar y eliminar tags
 * Expone estado de loading y errores
 *
 * @returns Objeto con métodos y estado de operaciones
 *
 * @example
 * const { createTag, updateProjectTags, isLoading, error } = useTagManagement()
 * const newTag = await createTag('mi-tag', '#FF5733')
 * await updateProjectTags('project-id', ['tag-id-1', 'tag-id-2'])
 */
export const useTagManagement = (): UseTagManagementReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Crea un nuevo tag
   * Validaciones:
   * - nombre no puede estar vacío
   * - nombre máximo 50 caracteres
   * - color debe ser un hex válido (#RRGGBB)
   */
  const createTag = async (name: string, color: string): Promise<Tag | null> => {
    // Validar input
    if (!name.trim()) {
      setError('El nombre del tag es requerido')
      return null
    }

    if (name.length > 50) {
      setError('El nombre debe tener máximo 50 caracteres')
      return null
    }

    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(color)) {
      setError('El color debe ser un código hex válido (#RRGGBB)')
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await api.createTag({
        name,
        color,
        type: 'custom',
      })
      return response.tag
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear tag'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Actualiza los tags de un proyecto
   */
  const updateProjectTags = async (
    projectId: string,
    tagIds: string[]
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await api.updateProjectTags(projectId, tagIds)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al actualizar tags'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Elimina un tag
   */
  const deleteTag = async (tagId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await api.deleteTag(tagId)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al eliminar tag'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createTag,
    updateProjectTags,
    deleteTag,
  }
}
