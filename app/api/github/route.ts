import { NextRequest, NextResponse } from "next/server"

export const revalidate = 300

function extractGithubUsername(input: string): string | null {
  if (!input) return null

  const trimmed = input.trim()

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
    if (url.hostname === "github.com") {
      const parts = url.pathname.split("/").filter(Boolean)
      return parts[0] ?? null
    }
  } catch {
    // not a URL — treat as raw username
    if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
      return trimmed
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("username")

  if (!raw) {
    return NextResponse.json({ error: "username is required" }, { status: 400 })
  }

  const username = extractGithubUsername(raw)

  if (!username) {
    return NextResponse.json({ error: "Invalid GitHub URL or username" }, { status: 400 })
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 300 },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 300 },
      }),
    ])

    if (userRes.status === 404) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 })
    }

    if (!userRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 })
    }

    const user = await userRes.json()
    const repos: any[] = reposRes.ok ? await reposRes.json() : []

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count ?? 0), 0)

    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        language: r.language ?? null,
        url: r.html_url,
        description: r.description ?? null,
      }))

    return NextResponse.json({
      name: user.name ?? user.login,
      login: user.login,
      avatar: user.avatar_url,
      bio: user.bio ?? null,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      publicRepos: user.public_repos ?? 0,
      profileUrl: user.html_url,
      totalStars,
      totalForks,
      topRepos,
    })
  } catch (err) {
    console.error("[github route]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
