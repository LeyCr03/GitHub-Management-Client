// Tipos de GitHub - Issue 02
// TODO: Completa los tipos según el issue 02

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
  pushed_at: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  html_url: string
}

export interface GitHubReadme {
  content: string
  download_url: string
  html_url: string
}
