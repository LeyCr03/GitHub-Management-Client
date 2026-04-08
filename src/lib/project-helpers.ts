/**
 * Helpers para trabajar con formato owner/repo
 * Issue 11 - Integración con Servidor NestJS
 */

/**
 * Convierte URL de GitHub a formato owner/repo
 * @example
 * urlToOwnerRepo('https://github.com/anthropics/claude-code') → 'anthropics/claude-code'
 */
export function urlToOwnerRepo(url: string): string {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/)
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${url}`)
  }
  return `${match[1]}/${match[2]}`
}

/**
 * Convierte owner/repo a URL de GitHub
 * @example
 * ownerRepoToUrl('anthropics/claude-code') → 'https://github.com/anthropics/claude-code'
 */
export function ownerRepoToUrl(ownerRepo: string): string {
  return `https://github.com/${ownerRepo}`
}

/**
 * Valida que el string esté en formato owner/repo
 */
export function isValidOwnerRepo(str: string): boolean {
  return /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(str)
}
