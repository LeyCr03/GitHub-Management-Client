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
    const response = await axios.get<GetProjectsResponse>('/projects', { params })
    return response.data
  }

  /**
   * Obtiene detalles completos de un proyecto
   */
  async getProjectDetail(projectId: string): Promise<GetProjectDetailResponse> {
    const response = await axios.get<GetProjectDetailResponse>(`/projects/${projectId}`)
    return response.data
  }

  // ===== TAGS =====

  /**
   * Obtiene todos los tags disponibles
   */
  async getTags() {
    const response = await axios.get<ApiResponse<any>>('/tags')
    return response.data.data
  }

  /**
   * Crea un nuevo tag
   */
  async createTag(tagData: CreateTagRequest): Promise<CreateTagResponse> {
    const response = await axios.post<CreateTagResponse>('/tags', tagData)
    return response.data
  }

  /**
   * Actualiza los tags de un proyecto
   */
  async updateProjectTags(
    projectId: string,
    tagIds: string[]
  ): Promise<UpdateProjectTagsResponse> {
    const payload: UpdateProjectTagsRequest = { tags: tagIds }
    const response = await axios.patch<UpdateProjectTagsResponse>(
      `/projects/${projectId}/tags`,
      payload
    )
    return response.data
  }

  /**
   * Elimina un tag
   */
  async deleteTag(tagId: string): Promise<void> {
    await axios.delete(`/tags/${tagId}`)
  }

  // ===== README =====

  /**
   * Obtiene el contenido del README en markdown
   */
  async getReadmeContent(projectId: string): Promise<string> {
    const response = await axios.get<{ content: string }>(
      `/projects/${projectId}/readme`
    )
    return response.data.content
  }

  // ===== COMMITS =====

  /**
   * Obtiene commits de un proyecto con límite configurado
   */
  async getProjectCommits(projectId: string, limit: number = 10) {
    const response = await axios.get(`/projects/${projectId}/commits`, {
      params: { limit },
    })
    return response.data
  }
}

// Exportar instancia única del API
export const api = new GitHubDashboardAPI()
