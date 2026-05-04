"use client"

import { useState, useEffect } from "react"

export interface GithubRepo {
  name: string
  stars: number
  forks: number
  language: string | null
  url: string
  description: string | null
}

export interface GithubStats {
  name: string
  login: string
  avatar: string
  bio: string | null
  followers: number
  following: number
  publicRepos: number
  profileUrl: string
  totalStars: number
  totalForks: number
  topRepos: GithubRepo[]
}

// Accepts either a full github_url ("https://github.com/username")
// or a bare username — the API route handles both.
export function useGithubStats(githubUrl: string | null | undefined) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!githubUrl) {
      setData(null)
      setError(null)
      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)
    setData(null)

    fetch(`/api/github?username=${encodeURIComponent(githubUrl)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.error) setError(json.error)
        else setData(json as GithubStats)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch GitHub stats")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [githubUrl])

  return { data, loading, error }
}
