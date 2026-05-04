"use client"

import { useState, useEffect } from "react"

export interface LeetcodeTag {
  tagName: string
  problemsSolved: number
}

export interface LeetcodeStats {
  username: string
  ranking: number
  avatar: string | null
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmissions: number
  topTags: LeetcodeTag[]
}

export function useLeetcodeStats(username: string | null | undefined) {
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

    fetch(`/api/leetcode?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.error) setError(json.error)
        else setData(json as LeetcodeStats)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch LeetCode stats")
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
