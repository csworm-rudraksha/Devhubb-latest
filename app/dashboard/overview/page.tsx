import { GithubStatsSection } from "@/components/dashboard/overview/github-stats"
import { LeetcodeStatsSection } from "@/components/dashboard/overview/leetcode-stats"
import { createClient } from "@/lib/supabase/server"

export default async function OverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let githubUrl: string | null = null
  let leetcodeUsername: string | null = null

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("github_url, leetcode_username")
      .eq("id", user.id)
      .single()

    if (data) {
      githubUrl = data.github_url || null
      leetcodeUsername = data.leetcode_username || null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your developer stats at a glance</p>
      </div>
      <GithubStatsSection githubUrl={githubUrl} />
      <LeetcodeStatsSection leetcodeUsername={leetcodeUsername} />
    </div>
  )
}
