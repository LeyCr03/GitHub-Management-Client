// Tipos de Proyecto - Issue 02

import { Tag } from './tags'
import { GitHubCommit } from './github'

export interface ProjectReadme {
  content: string
  rawUrl: string
  lastUpdated: string
}

export interface ProjectImage {
  url: string
  alt: string
  name: string
}

export interface Project {
  id: string
  repositoryId: number
  name: string
  description: string
  url: string
  tags: Tag[]
  readme?: ProjectReadme
  coverImage?: ProjectImage
  images: ProjectImage[]
  commits: GitHubCommit[]
  stats: {
    stars: number
    forks: number
    openIssues: number
    language?: string
  }
  updatedAt: string
  createdAt: string
  visibility: 'public' | 'private'
}

export interface ProjectDetail extends Project {
  contributors: number
  watchers: number
  defaultBranch: string
}

export interface ProjectCreateRequest {
  repositoryId: number
  tags: string[]
}

export interface ProjectUpdateRequest {
  tags: string[]
  coverImage?: ProjectImage
}
