import { NextRequest, NextResponse } from "next/server"

export const revalidate = 300

const LEETCODE_QUERY = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
      userAvatar
      realName
    }
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }
      intermediate {
        tagName
        problemsSolved
      }
      fundamental {
        tagName
        problemsSolved
      }
    }
  }
}`

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")

  if (!username || username.trim() === "") {
    return NextResponse.json({ error: "username is required" }, { status: 400 })
  }

  const clean = username.trim()

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        Origin: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (compatible; DevHubb/1.0)",
      },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username: clean } }),
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "LeetCode API error" }, { status: 502 })
    }

    const json = await res.json()
    const user = json?.data?.matchedUser

    if (!user) {
      return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 })
    }

    const acNums: { difficulty: string; count: number; submissions: number }[] =
      user.submitStats?.acSubmissionNum ?? []

    const getCount = (d: string) => acNums.find((x) => x.difficulty === d)?.count ?? 0

    const allTags = [
      ...(user.tagProblemCounts?.fundamental ?? []),
      ...(user.tagProblemCounts?.intermediate ?? []),
      ...(user.tagProblemCounts?.advanced ?? []),
    ]

    const topTags = allTags
      .sort((a: any, b: any) => b.problemsSolved - a.problemsSolved)
      .slice(0, 6)
      .map((t: any) => ({ tagName: t.tagName, problemsSolved: t.problemsSolved }))

    return NextResponse.json({
      username: user.username,
      ranking: user.profile?.ranking ?? 0,
      avatar: user.profile?.userAvatar ?? null,
      totalSolved: getCount("All"),
      easySolved: getCount("Easy"),
      mediumSolved: getCount("Medium"),
      hardSolved: getCount("Hard"),
      totalSubmissions: acNums.find((x) => x.difficulty === "All")?.submissions ?? 0,
      topTags,
    })
  } catch (err) {
    console.error("[leetcode route]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
