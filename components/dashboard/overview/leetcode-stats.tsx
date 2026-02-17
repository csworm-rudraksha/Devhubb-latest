"use client"

import { DUMMY_LEETCODE_STATS } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Flame, TrendingUp } from "lucide-react"

const lc = DUMMY_LEETCODE_STATS

export function LeetcodeStatsSection() {
  const total = lc.easySolved + lc.mediumSolved + lc.hardSolved
  const easyPct = (lc.easySolved / total) * 100
  const medPct = (lc.mediumSolved / total) * 100
  const hardPct = (lc.hardSolved / total) * 100

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.014.013c.424.373.958.416 1.384.156a1.38 1.38 0 0 0 .466-1.897 5.036 5.036 0 0 0-.7-.755 5.048 5.048 0 0 0-1.27-.868z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">LeetCode</h2>
        <span className="text-sm text-muted-foreground">@{lc.username}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} label="Total Solved" value={lc.totalSolved} />
        <StatCard icon={Trophy} label="Contest Rating" value={lc.contestRating} />
        <StatCard icon={Flame} label="Current Streak" value={`${lc.streak} days`} />
        <StatCard icon={TrendingUp} label="Acceptance" value={`${lc.acceptanceRate}%`} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Problem Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pt-2">
              <DifficultyBar label="Easy" solved={lc.easySolved} pct={easyPct} color="bg-chart-1" />
              <DifficultyBar label="Medium" solved={lc.mediumSolved} pct={medPct} color="bg-chart-3" />
              <DifficultyBar label="Hard" solved={lc.hardSolved} pct={hardPct} color="bg-destructive" />
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 pt-1">
              {lc.recentSubmissions.map((sub) => (
                <div key={sub.title} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{sub.title}</span>
                    <Badge
                      variant="secondary"
                      className={
                        sub.difficulty === "Easy"
                          ? "bg-chart-1/10 text-chart-1"
                          : sub.difficulty === "Medium"
                          ? "bg-chart-3/10 text-chart-3"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {sub.difficulty}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{sub.date}</span>
                </div>
              ))}
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
