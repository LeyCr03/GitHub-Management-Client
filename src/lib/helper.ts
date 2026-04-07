import { RepoTag } from "@/types/tags";

export const RepoTagLabels: Record<RepoTag, string> = {
  [RepoTag.COMMERCIAL]: 'Commercial Projects',
  [RepoTag.SIDE_PROJECT]: 'Side Projects',
  [RepoTag.UNFINISHED]: 'Unfinished Projects',
  [RepoTag.PET_PROJECT]: 'Pet Projects',
};

// Helpers - Issue 03
// TODO: Completa según issue 03

/**
 * Construye URL relativa para imagen
 */
export const getImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_BASE_URL}/images/${imageUrl}`
}

/**
 * Formatea fecha para display
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Obtiene el dominio del repositorio
 */
export const getRepoOwner = (url: string): string => {
  const match = url.match(/github\.com\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Obtiene el nombre del repositorio
 */
export const getRepoName = (url: string): string => {
  const match = url.match(/github\.com\/[^/]+\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Abrevia número (1000 → 1k)
 */
export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}