"use client"

import { useState, useEffect } from "react"

export interface CodechefStats {
  username: string
  rating: number
  stars: number
  highestRating: number
  globalRank: number | null
  countryRank: number | null
  problemsSolved: number
  contestsParticipated: number
  division: string | null
  profileUrl: string
}

export function useCodechefStats(username: string | null | undefined) {
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

    fetch(`/api/codechef?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        if (json.error) setError(json.error)
        else setData(json as CodechefStats)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch CodeChef stats")
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
