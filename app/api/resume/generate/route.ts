import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchGitHubStats } from "@/lib/github"
import { generateResume, generateCoverLetter } from "@/lib/ai-resume"
import { getCachedResume, upsertResume } from "@/lib/resume-store"
import { ResumeTone } from "@/types/resume"

const VALID_TONES: ResumeTone[] = ["technical", "startup", "enterprise", "internship"]

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { github_username, tone, target_role } = body

    // Validate inputs
    if (!github_username || typeof github_username !== "string") {
      return NextResponse.json(
        { error: "github_username is required and must be a string" },
        { status: 400 }
      )
    }

    if (!tone || !VALID_TONES.includes(tone)) {
      return NextResponse.json(
        { error: `tone must be one of: ${VALID_TONES.join(", ")}` },
        { status: 400 }
      )
    }

    // Check cache first
    const cached = await getCachedResume(user.id, github_username, tone)
    if (cached) {
      return NextResponse.json(
        {
          resume: cached.resume_data,
          cover_letter: cached.cover_letter_data,
          github_stats: cached.github_stats,
          cached: true,
        },
        { status: 200 }
      )
    }

    // Fetch GitHub stats
    let githubStats
    try {
      githubStats = await fetchGitHubStats(github_username)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      if (message.includes("not found")) {
        return NextResponse.json(
          { error: `GitHub user "${github_username}" not found` },
          { status: 404 }
        )
      }
      throw error
    }

    // Generate resume
    const resume = await generateResume(githubStats, tone, target_role)

    // Generate cover letter
    const coverLetter = await generateCoverLetter(githubStats, resume, tone, target_role)

    // Save to Supabase
    await upsertResume({
      userId: user.id,
      githubUsername: github_username,
      tone,
      targetRole: target_role || null,
      resumeData: resume,
      coverLetterData: coverLetter,
      githubStats,
    })

    return NextResponse.json(
      {
        resume,
        cover_letter: coverLetter,
        github_stats: githubStats,
        cached: false,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resume generation error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Failed to generate resume: ${message}` },
      { status: 500 }
    )
  }
}
