import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResumeBuilder } from "@/components/resume/ResumeBuilder"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Resume Builder — DevHubb",
  description: "Generate a recruiter-ready resume and cover letter from your GitHub activity.",
}

export default async function ResumePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Extract GitHub username from user metadata
  const githubUsername =
    user.user_metadata?.user_name || user.user_metadata?.preferred_username || ""

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <ResumeBuilder defaultGithubUsername={githubUsername} />
    </div>
  )
}
