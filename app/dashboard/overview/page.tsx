import { GithubStatsSection } from "@/components/dashboard/overview/github-stats"
import { LeetcodeStatsSection } from "@/components/dashboard/overview/leetcode-stats"

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your developer stats at a glance</p>
      </div>
      <GithubStatsSection />
      <LeetcodeStatsSection />
    </div>
  )
}
