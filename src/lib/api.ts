/**
 * Cliente API centralizado
 * Issue 03 - Cliente API
 *
 * Métodos para comunicarse con el backend:
 * - Proyectos (GET, GET detail)
 * - Tags (GET, CREATE, UPDATE, DELETE)
 * - README
 * - Commits
 */

import axios from './axios-instance'
import {
  GetProjectsResponse,
  GetProjectDetailResponse,
  UpdateProjectTagsResponse,
  CreateTagResponse,
  UpdateProjectTagsRequest,
  CreateTagRequest,
  ApiResponse,
} from '@/types'

class GitHubDashboardAPI {
  // ===== PROYECTOS =====

  /**
   * Obtiene lista de proyectos con filtro opcional de tag
   */
  async getProjects(filterTag?: string): Promise<GetProjectsResponse> {
    const params = filterTag ? { tag: filterTag } : {}
    const response = await axios.get<GetProjectsResponse>('/api/projects', { params })
    return response.data
  }

  /**
   * Obtiene detalles completos de un proyecto
   * @param ownerRepo Formato: "owner/repo" (ej: "anthropics/claude-code")
   */
  async getProjectDetail(ownerRepo: string): Promise<GetProjectDetailResponse> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    const response = await axios.get<GetProjectDetailResponse>(`/api/projects/${ownerRepo}`)
    return response.data
  }

  // ===== TAGS =====

  /**
   * Obtiene todos los tags disponibles
   */
  async getTags() {
    const response = await axios.get<ApiResponse<any>>('/api/tags')
    return response.data.data
  }

  /**
   * Crea un nuevo tag
   */
  async createTag(tagData: CreateTagRequest): Promise<CreateTagResponse> {
    const response = await axios.post<CreateTagResponse>('/api/tags', tagData)
    return response.data
  }

  /**
   * Actualiza los tags de un proyecto
   * @param ownerRepo Formato: "owner/repo"
   */
  async updateProjectTags(
    ownerRepo: string,
    tagIds: string[]
  ): Promise<UpdateProjectTagsResponse> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    const payload: UpdateProjectTagsRequest = { tags: tagIds }
    const response = await axios.patch<UpdateProjectTagsResponse>(
      `/api/projects/${ownerRepo}/tags`,
      payload
    )
    return response.data
  }

  /**
   * Elimina un tag
   */
  async deleteTag(tagId: string): Promise<void> {
    await axios.delete(`/api/tags/${tagId}`)
  }

  // ===== README =====

  /**
   * Obtiene el contenido del README en markdown
   * @param ownerRepo Formato: "owner/repo"
   */
  async getReadmeContent(ownerRepo: string): Promise<string> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    const response = await axios.get<{ content: string }>(
      `/api/projects/${ownerRepo}/readme`
    )
    return response.data.content
  }

  // ===== COMMITS =====

  /**
   * Obtiene commits de un proyecto con límite configurable
   * @param ownerRepo Formato: "owner/repo"
   */
  async getProjectCommits(ownerRepo: string, limit: number = 10) {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    const response = await axios.get(`/api/projects/${ownerRepo}/commits`, {
      params: { limit },
    })
    return response.data
  }
}

// Exportar instancia única del API
export const api = new GitHubDashboardAPI()
