/**
 * Helpers y utilidades
 * Issue 03 - Cliente API
 */

import { RepoTag } from "@/types/tags";

/**
 * Etiquetas legacy para tipos de repositorio
 */
export const RepoTagLabels: Record<RepoTag, string> = {
  [RepoTag.COMMERCIAL]: 'Commercial Projects',
  [RepoTag.SIDE_PROJECT]: 'Side Projects',
  [RepoTag.UNFINISHED]: 'Unfinished Projects',
  [RepoTag.PET_PROJECT]: 'Pet Projects',
};

/**
 * Construye URL completa para imagen desde ruta relativa
 * @example
 * getImageUrl('project-banner.png') // http://localhost:3000/api/images/project-banner.png
 * getImageUrl('https://...') // https://... (devuelve tal cual)
 * getImageUrl(null) // null
 */
export const getImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_BASE_URL}/images/${imageUrl}`
}

/**
 * Formatea fecha a formato legible en español
 * @example
 * formatDate('2026-04-07') // '7 abr 2026'
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
 * Extrae el owner de una URL de GitHub
 * @example
 * getRepoOwner('https://github.com/octocat/Hello-World') // 'octocat'
 */
export const getRepoOwner = (url: string): string => {
  const match = url.match(/github\.com\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Extrae el nombre del repositorio de una URL de GitHub
 * @example
 * getRepoName('https://github.com/octocat/Hello-World') // 'Hello-World'
 */
export const getRepoName = (url: string): string => {
  const match = url.match(/github\.com\/[^/]+\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Abrevia números grandes a formato más legible
 * @example
 * abbreviateNumber(1000) // '1k'
 * abbreviateNumber(1500000) // '1.5M'
 * abbreviateNumber(42) // '42'
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