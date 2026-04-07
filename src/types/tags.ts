/**
 * Tipos de Tags - Issue 02
 * Interfaces y tipos para gestión de tags
 */

export type TagType = 'finished' | 'side-project' | 'pet-project' | 'learning' | 'archived' | 'custom'

export interface Tag {
  id: string
  name: string
  color: string // hex color: #FF5733
  type: TagType
  createdAt: string
  updatedAt: string
}

export interface TagColorMap {
  finished: string
  'side-project': string
  'pet-project': string
  learning: string
  archived: string
  custom: string
}

/**
 * Legacy enum - para compatibilidad con código existente
 */
export enum RepoTag {
  COMMERCIAL = 'commercial',
  SIDE_PROJECT = 'side-project',
  UNFINISHED = 'unfinished',
  PET_PROJECT = 'pet-project',
}