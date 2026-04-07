/**
 * Tipos de API - Issue 02
 * Interfaces para requests y responses del backend
 */

import { Project, ProjectDetail } from './project'
import { Tag } from './tags'

export interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
  timestamp: string
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  code: string
  timestamp: string
}

export interface GetProjectsResponse {
  projects: Project[]
  total: number
  tags: Tag[]
}

export interface GetProjectDetailResponse {
  project: ProjectDetail
}

export interface UpdateProjectTagsRequest {
  tags: string[] // Tag IDs
}

export interface UpdateProjectTagsResponse {
  project: Project
}

export interface CreateTagRequest {
  name: string
  color: string
  type: 'custom'
}

export interface CreateTagResponse {
  tag: Tag
}
