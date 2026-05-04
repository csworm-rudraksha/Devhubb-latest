"use client"

import { useState } from "react"
import { useHackerrankStats } from "@/hooks/use-hackerrank-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Award } from "lucide-react"
import { PlatformUsernameInput } from "@/components/dashboard/platform-username-input"
import { createClient } from "@/lib/supabase/client"

export function HackerrankStatsSection({ hackerrankUsername, userId }: { hackerrankUsername: string | null; userId: string }) {
  const [currentHackerrankUsername, setCurrentHackerrankUsername] = useState(hackerrankUsername)
  const { data, loading, error } = useHackerrankStats(currentHackerrankUsername)

  const handleSaveHackerrankUsername = async (value: string) => {
    const supabase = createClient()
    await supabase.from("profiles").update({ hackerrank_username: value || null }).eq("id", userId)
    setCurrentHackerrankUsername(value || null)
  }

  if (!currentHackerrankUsername) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">HackerRank</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <PlatformUsernameInput
              platform="hackerrank"
              label="HackerRank Username"
              placeholder="your_hackerrank_username"
              currentValue={currentHackerrankUsername}
              onSave={handleSaveHackerrankUsername}
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
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">HackerRank</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">Could not load HackerRank stats</p>
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
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">HackerRank</h2>
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
        <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">HackerRank</h2>
        <span className="text-sm text-muted-foreground">@{data.username}</span>
      </div>

      <div className="mb-4">
        <PlatformUsernameInput
          platform="hackerrank"
          label="HackerRank Username"
          placeholder="your_hackerrank_username"
          currentValue={currentHackerrankUsername}
          onSave={handleSaveHackerrankUsername}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} label="Challenges Solved" value={data.totalChallengesSolved} />
        <StatCard icon={Trophy} label="Points" value={data.currentPoints.toLocaleString()} />
        <StatCard icon={Award} label="Level" value={data.level ?? "N/A"} />
        <StatCard icon={Award} label="Badges" value={data.badges.length} />
      </div>

      {data.badges.length > 0 && (
        <div className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {data.badges.map((badge) => (
                  <Badge key={badge.name} variant="secondary">
                    {badge.name} ({badge.stars}★)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
