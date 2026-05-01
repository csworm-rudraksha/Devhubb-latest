import { GitHubRepo, GitHubStats } from "@/types/resume"

const GITHUB_API = "https://api.github.com"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

function getHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`
  }
  return headers
}

export async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&sort=updated&direction=desc`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found`)
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      hasMore = false
    } else {
      repos.push(...data)
      page++
    }
  }

  return repos
}

export async function estimateCommitCount(
  username: string,
  repos: GitHubRepo[]
): Promise<number> {
  const topRepos = repos.slice(0, 10).sort((a, b) => b.size - a.size)
  let totalCommits = 0

  for (const repo of topRepos) {
    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${username}/${repo.name}/contributors?per_page=1`,
        {
          headers: getHeaders(),
          next: { revalidate: 3600 },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const userContributor = data.find(
            (c: any) => c.login.toLowerCase() === username.toLowerCase()
          )
          if (userContributor) {
            totalCommits += userContributor.contributions
          }
        }
      }
    } catch {
      // Skip on error
    }
  }

  return totalCommits
}

export function aggregateLanguages(
  langMaps: Record<string, number>[]
): Record<string, number> {
  const aggregated: Record<string, number> = {}

  for (const langMap of langMaps) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      aggregated[lang] = (aggregated[lang] || 0) + bytes
    }
  }

  return aggregated
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  // Fetch user profile
  const userResponse = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  })

  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error(`GitHub user "${username}" not found`)
    }
    throw new Error(`GitHub API error: ${userResponse.status}`)
  }

  const userProfile = await userResponse.json()

  // Fetch all repos
  const repos = await fetchAllRepos(username)

  // Fetch languages for top 20 repos
  const topRepos = repos.slice(0, 20)
  const languageMaps: Record<string, number>[] = []

  await Promise.all(
    topRepos.map(async (repo) => {
      try {
        const langResponse = await fetch(
          `${GITHUB_API}/repos/${username}/${repo.name}/languages`,
          {
            headers: getHeaders(),
            next: { revalidate: 3600 },
          }
        )

        if (langResponse.ok) {
          const langData = await langResponse.json()
          languageMaps.push(langData)
        }
      } catch {
        // Skip on error
      }
    })
  )

  const topLanguages = aggregateLanguages(languageMaps)
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const commitCount = await estimateCommitCount(username, repos)

  return {
    username: userProfile.login,
    name: userProfile.name,
    bio: userProfile.bio,
    avatar_url: userProfile.avatar_url,
    public_repos: userProfile.public_repos,
    followers: userProfile.followers,
    following: userProfile.following,
    total_stars: totalStars,
    top_languages: topLanguages,
    repos,
    commit_count_estimate: commitCount,
  }
}
