import { NextRequest, NextResponse } from "next/server"

export const revalidate = 300

function extractHackerrankUsername(input: string): string | null {
  if (!input) return null

  const trimmed = input.trim()

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
    if (url.hostname === "www.hackerrank.com" || url.hostname === "hackerrank.com") {
      const parts = url.pathname.split("/").filter(Boolean)
      // handles /profile/username or /username
      const idx = parts.indexOf("profile")
      return idx !== -1 ? (parts[idx + 1] ?? null) : (parts[0] ?? null)
    }
  } catch {
    if (/^[a-zA-Z0-9_-]{1,50}$/.test(trimmed)) return trimmed
  }

  return null
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("username")

  if (!raw) {
    return NextResponse.json({ error: "username is required" }, { status: 400 })
  }

  const username = extractHackerrankUsername(raw)

  if (!username) {
    return NextResponse.json({ error: "Invalid HackerRank username or URL" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DevHubb/1.0)",
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      }
    )

    if (res.status === 404) {
      return NextResponse.json({ error: "HackerRank user not found" }, { status: 404 })
    }

    if (!res.ok) {
      return NextResponse.json({ error: "HackerRank API error" }, { status: 502 })
    }

    const json = await res.json()
    const model = json?.model

    if (!model) {
      return NextResponse.json({ error: "HackerRank user not found" }, { status: 404 })
    }

    // Extract badge names and levels
    const badges: { name: string; stars: number }[] = (model.badges ?? []).map((b: any) => ({
      name: b.badge_name ?? b.name ?? "",
      stars: b.stars ?? b.level ?? 0,
    }))

    return NextResponse.json({
      username: model.username ?? username,
      name: model.name ?? null,
      avatar: model.avatar ?? null,
      country: model.country ?? null,
      level: model.level ?? null,
      currentPoints: model.current_points ?? model.score ?? 0,
      totalChallengesSolved: model.solved_challenges ?? 0,
      badges,
      profileUrl: `https://www.hackerrank.com/profile/${username}`,
    })
  } catch (err) {
    console.error("[hackerrank route]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
