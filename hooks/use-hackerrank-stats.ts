"use client"

import { useState, useEffect } from "react"

export interface HackerrankBadge {
  name: string
  stars: number
}

export interface HackerrankStats {
  username: string
  name: string | null
  avatar: string | null
  country: string | null
  level: string | null
  currentPoints: number
  totalChallengesSolved: number
  badges: HackerrankBadge[]
  profileUrl: string
}

export function useHackerrankStats(username: string | null | undefined) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) {
      setData(null)
      setError(null)
      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)
    setData(null)

    fetch(`/api/hackerrank?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.error) setError(json.error)
        else setData(json as HackerrankStats)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch HackerRank stats")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return { data, loading, error }
}
