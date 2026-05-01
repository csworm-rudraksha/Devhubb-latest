// GitHub API types
export interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  topics: string[]
  updated_at: string
  created_at: string
  size: number
}

export interface GitHubStats {
  username: string
  name: string | null
  bio: string | null
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  total_stars: number
  top_languages: Record<string, number>
  repos: GitHubRepo[]
  commit_count_estimate: number
}

// Resume types
export type ResumeTone = "technical" | "startup" | "enterprise" | "internship"

export interface ResumeProject {
  name: string
  description: string
  technologies: string[]
  highlights: string[]
  url: string
  confidence_score: number
  stars: number
}

export interface ResumeSection {
  summary: string
  top_skills: string[]
  projects: ResumeProject[]
  education_prompt: string
  tone_used: ResumeTone
  generated_at: string
}

export interface CoverLetter {
  body: string
  tone_used: ResumeTone
  generated_at: string
}

export interface ResumeGenerationRequest {
  github_username: string
  tone: ResumeTone
  target_role?: string
  user_id: string
}

export interface ResumeGenerationResult {
  resume: ResumeSection
  cover_letter: CoverLetter
  github_stats: GitHubStats
  cached: boolean
}

export interface ResumeRecord {
  id: string
  user_id: string
  github_username: string
  tone: ResumeTone
  target_role: string | null
  resume_data: ResumeSection
  cover_letter_data: CoverLetter
  github_stats: GitHubStats
  created_at: string
  updated_at: string
}
