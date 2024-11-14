export interface GitHubRepo {
  id: number
  name: string
  description: string
  stargazers_count: number
  open_issues_count: number
  pushed_at: string
  owner: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
}

export interface RepoStats {
stargazers_count: number
forks_count: number
watchers_count: number
open_issues_count: number

export interface GitHubSearchResponse {
  items: GitHubRepo[]
  total_count: number
}

export interface GitHubRepo {
id: number
name: string
description: string
stargazers_count: number
open_issues_count: number
pushed_at: string
owner: {
login: string
avatar_url: string
}
created_at: string
updated_at: string
}

export interface GitHubResponse {
items: GitHubRepo[]
total_count: number
}