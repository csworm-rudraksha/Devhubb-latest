import { createClient } from "@supabase/supabase-js"
import { ResumeRecord, ResumeSection, CoverLetter, GitHubStats, ResumeTone } from "@/types/resume"

const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function getCachedResume(
  userId: string,
  githubUsername: string,
  tone: ResumeTone
): Promise<ResumeRecord | null> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .eq("github_username", githubUsername)
    .eq("tone", tone)
    .single()

  if (error || !data) {
    return null
  }

  // Check if cache is still fresh
  const updatedAt = new Date(data.updated_at).getTime()
  const now = Date.now()
  if (now - updatedAt > CACHE_TTL_MS) {
    return null
  }

  return data as ResumeRecord
}

export async function upsertResume({
  userId,
  githubUsername,
  tone,
  targetRole,
  resumeData,
  coverLetterData,
  githubStats,
}: {
  userId: string
  githubUsername: string
  tone: ResumeTone
  targetRole: string | null
  resumeData: ResumeSection
  coverLetterData: CoverLetter
  githubStats: GitHubStats
}): Promise<ResumeRecord> {
  const { data, error } = await supabase
    .from("resumes")
    .upsert(
      {
        user_id: userId,
        github_username: githubUsername,
        tone,
        target_role: targetRole,
        resume_data: resumeData,
        cover_letter_data: coverLetterData,
        github_stats: githubStats,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,github_username,tone",
      }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to upsert resume: ${error.message}`)
  }

  return data as ResumeRecord
}

export async function getUserResumes(userId: string): Promise<ResumeRecord[]> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`)
  }

  return (data || []) as ResumeRecord[]
}
