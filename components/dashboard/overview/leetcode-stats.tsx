"use client"

import { useState } from "react"
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp } from "lucide-react"
import { PlatformUsernameInput } from "@/components/dashboard/platform-username-input"
import { createClient } from "@/lib/supabase/client"

export function LeetcodeStatsSection({ leetcodeUsername, userId }: { leetcodeUsername: string | null; userId: string }) {
  const [currentLeetcodeUsername, setCurrentLeetcodeUsername] = useState(leetcodeUsername)
  const { data, loading, error } = useLeetcodeStats(currentLeetcodeUsername)

  const handleSaveLeetcodeUsername = async (value: string) => {
    const supabase = createClient()
    await supabase.from("profiles").update({ leetcode_username: value || null }).eq("id", userId)
    setCurrentLeetcodeUsername(value || null)
  }

  if (!currentLeetcodeUsername) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.014.013c.424.373.958.416 1.384.156a1.38 1.38 0 0 0 .466-1.897 5.036 5.036 0 0 0-.7-.755 5.048 5.048 0 0 0-1.27-.868z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">LeetCode</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <PlatformUsernameInput
              platform="leetcode"
              label="LeetCode Username"
              placeholder="your_leetcode_username"
              currentValue={currentLeetcodeUsername}
              onSave={handleSaveLeetcodeUsername}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.014.013c.424.373.958.416 1.384.156a1.38 1.38 0 0 0 .466-1.897 5.036 5.036 0 0 0-.7-.755 5.048 5.048 0 0 0-1.27-.868z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">LeetCode</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.014.013c.424.373.958.416 1.384.156a1.38 1.38 0 0 0 .466-1.897 5.036 5.036 0 0 0-.7-.755 5.048 5.048 0 0 0-1.27-.868z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">LeetCode</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const total = data.easySolved + data.mediumSolved + data.hardSolved
  const easyPct = total > 0 ? (data.easySolved / total) * 100 : 0
  const medPct = total > 0 ? (data.mediumSolved / total) * 100 : 0
  const hardPct = total > 0 ? (data.hardSolved / total) * 100 : 0

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.014.013c.424.373.958.416 1.384.156a1.38 1.38 0 0 0 .466-1.897 5.036 5.036 0 0 0-.7-.755 5.048 5.048 0 0 0-1.27-.868z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">LeetCode</h2>
        <span className="text-sm text-muted-foreground">@{data.username}</span>
      </div>

      <div className="mb-4">
        <PlatformUsernameInput
          platform="leetcode"
          label="LeetCode Username"
          placeholder="your_leetcode_username"
          currentValue={currentLeetcodeUsername}
          onSave={handleSaveLeetcodeUsername}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} label="Total Solved" value={data.totalSolved} />
        <StatCard icon={Trophy} label="Ranking" value={`#${data.ranking.toLocaleString()}`} />
        <StatCard icon={TrendingUp} label="Submissions" value={data.totalSubmissions.toLocaleString()} />
        <StatCard icon={Trophy} label="Easy/Med/Hard" value={`${data.easySolved}/${data.mediumSolved}/${data.hardSolved}`} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Problem Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pt-2">
              <DifficultyBar label="Easy" solved={data.easySolved} pct={easyPct} color="bg-chart-1" />
              <DifficultyBar label="Medium" solved={data.mediumSolved} pct={medPct} color="bg-chart-3" />
              <DifficultyBar label="Hard" solved={data.hardSolved} pct={hardPct} color="bg-destructive" />
            </div>

            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-secondary">
              <div className="bg-chart-1 transition-all" style={{ width: `${easyPct}%` }} />
              <div className="bg-chart-3 transition-all" style={{ width: `${medPct}%` }} />
              <div className="bg-destructive transition-all" style={{ width: `${hardPct}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {data.topTags.length > 0 ? (
                data.topTags.map((tag) => (
                  <Badge key={tag.tagName} variant="secondary">
                    {tag.tagName} ({tag.problemsSolved})
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DifficultyBar({
  label,
  solved,
  pct,
  color,
}: {
  label: string
  solved: number
  pct: number
  color: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{solved}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
