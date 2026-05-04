"use client"

import { useGithubStats } from "@/hooks/use-github-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Star, GitFork, Users } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export function GithubStatsSection({ githubUrl }: { githubUrl: string | null }) {
  const { data, loading, error } = useGithubStats(githubUrl)

  if (!githubUrl) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Github className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Add your GitHub URL in Settings to see your stats</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Github className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
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
          <Github className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
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

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Github className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
        <span className="text-sm text-muted-foreground">@{data.login}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GitFork} label="Repositories" value={data.publicRepos} />
        <StatCard icon={Star} label="Total Stars" value={data.totalStars.toLocaleString()} />
        <StatCard icon={Users} label="Followers" value={data.followers.toLocaleString()} />
        <StatCard icon={Users} label="Following" value={data.following.toLocaleString()} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 pt-2">
              {data.topRepos.length > 0 ? (
                data.topRepos.map((repo) => (
                  <div key={repo.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {repo.name}
                      </a>
                      {repo.language && (
                        <p className="text-xs text-muted-foreground">{repo.language}</p>
                      )}
                    </div>
                    <div className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No repositories found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Forks</span>
                <span className="font-medium text-foreground">{data.totalForks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Public Repos</span>
                <span className="font-medium text-foreground">{data.publicRepos}</span>
              </div>
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
