"use client"

import { DUMMY_GITHUB_STATS } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Star, GitFork, Users, GitCommitHorizontal } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

const stats = DUMMY_GITHUB_STATS

export function GithubStatsSection() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Github className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
        <span className="text-sm text-muted-foreground">@{stats.username}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GitFork} label="Repositories" value={stats.publicRepos} />
        <StatCard icon={Star} label="Total Stars" value={stats.totalStars.toLocaleString()} />
        <StatCard icon={Users} label="Followers" value={stats.followers.toLocaleString()} />
        <StatCard icon={GitCommitHorizontal} label="Commits" value={stats.totalCommits.toLocaleString()} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.contributionData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-popover-foreground)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                    {stats.contributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="var(--color-primary)" fillOpacity={0.6 + index * 0.05} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pt-2">
              {stats.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
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
