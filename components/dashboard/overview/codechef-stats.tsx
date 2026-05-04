"use client"

import { useState } from "react"
import { useCodechefStats } from "@/hooks/use-codechef-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp } from "lucide-react"
import { PlatformUsernameInput } from "@/components/dashboard/platform-username-input"
import { createClient } from "@/lib/supabase/client"

export function CodechefStatsSection({ codechefUsername, userId }: { codechefUsername: string | null; userId: string }) {
  const [currentCodechefUsername, setCurrentCodechefUsername] = useState(codechefUsername)
  const { data, loading, error } = useCodechefStats(currentCodechefUsername)

  const handleSaveCodechefUsername = async (value: string) => {
    const supabase = createClient()
    await supabase.from("profiles").update({ codechef_username: value || null }).eq("id", userId)
    setCurrentCodechefUsername(value || null)
  }

  if (!currentCodechefUsername) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">CodeChef</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <PlatformUsernameInput
              platform="codechef"
              label="CodeChef Username"
              placeholder="your_codechef_username"
              currentValue={currentCodechefUsername}
              onSave={handleSaveCodechefUsername}
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
          <h2 className="text-lg font-semibold text-foreground">CodeChef</h2>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">Could not load CodeChef stats</p>
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
          <h2 className="text-lg font-semibold text-foreground">CodeChef</h2>
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
        <h2 className="text-lg font-semibold text-foreground">CodeChef</h2>
        <span className="text-sm text-muted-foreground">@{data.username}</span>
      </div>

      <div className="mb-4">
        <PlatformUsernameInput
          platform="codechef"
          label="CodeChef Username"
          placeholder="your_codechef_username"
          currentValue={currentCodechefUsername}
          onSave={handleSaveCodechefUsername}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} label="Problems Solved" value={data.problemsSolved} />
        <StatCard icon={Trophy} label="Rating" value={data.rating} />
        <StatCard icon={TrendingUp} label="Highest Rating" value={data.highestRating} />
        <StatCard icon={Trophy} label="Contests" value={data.contestsParticipated} />
      </div>

      {data.division && (
        <div className="mt-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Division</span>
                <Badge variant="secondary">{data.division}</Badge>
              </div>
              {data.globalRank && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Global Rank</span>
                  <span className="font-medium text-foreground">#{data.globalRank.toLocaleString()}</span>
                </div>
              )}
              {data.countryRank && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Country Rank</span>
                  <span className="font-medium text-foreground">#{data.countryRank.toLocaleString()}</span>
                </div>
              )}
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
