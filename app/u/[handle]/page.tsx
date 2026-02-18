import { DUMMY_USER, DUMMY_GITHUB_STATS, DUMMY_LEETCODE_STATS } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Code2,
  MapPin,
  Building2,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Star,
  GitFork,
  Users,
  Target,
  Trophy,
  Flame,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const supabase = await createClient()

  // Try to fetch from Supabase
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle)
    .eq("is_public", true)
    .single()

  // Build user object from profile or fallback to dummy
  const user = profile
    ? {
        fullName: profile.full_name || handle,
        handle: profile.handle || handle,
        bio: profile.bio || "",
        college: profile.college || "",
        city: profile.city || "",
        githubUrl: profile.github_url || "#",
        linkedinUrl: profile.linkedin_url || "#",
        twitterUrl: profile.twitter_url || "#",
      }
    : handle === DUMMY_USER.handle
      ? DUMMY_USER
      : null

  if (!user) {
    notFound()
  }

  // For now, always use dummy stats (GitHub/LeetCode APIs can be wired later)
  const gh = DUMMY_GITHUB_STATS
  const lc = DUMMY_LEETCODE_STATS

  const initials = user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Code2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">DevHubb</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/signup">Join DevHubb</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-xl text-primary">{initials}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold text-foreground">{user.fullName}</h1>
          <p className="text-sm text-primary">@{user.handle}</p>
          {user.bio && (
            <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {user.college && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {user.college}
              </span>
            )}
            {user.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {user.city}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            {user.githubUrl && user.githubUrl !== "#" && (
              <Link href={user.githubUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-4 w-4" />
                GitHub
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            {user.linkedinUrl && user.linkedinUrl !== "#" && (
              <Link href={user.linkedinUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            {user.twitterUrl && user.twitterUrl !== "#" && (
              <Link href={user.twitterUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-4 w-4" />
                Twitter
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStatCard icon={GitFork} label="Repos" value={gh.publicRepos} />
          <MiniStatCard icon={Star} label="Stars" value={gh.totalStars.toLocaleString()} />
          <MiniStatCard icon={Users} label="Followers" value={gh.followers.toLocaleString()} />
          <MiniStatCard icon={Target} label="LC Solved" value={lc.totalSolved} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <MiniStatCard icon={Trophy} label="Contest Rating" value={lc.contestRating} />
          <MiniStatCard icon={Flame} label="Streak" value={`${lc.streak} days`} />
          <Card className="border-border bg-card col-span-2 sm:col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <p className="text-2xl font-bold text-foreground">{lc.acceptanceRate}%</p>
              <p className="text-xs text-muted-foreground">Acceptance Rate</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-border bg-card">
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-medium text-muted-foreground">Top Languages</p>
            <div className="flex flex-wrap gap-2">
              {gh.topLanguages.map((lang) => (
                <Badge key={lang.name} variant="secondary" className="gap-1.5 px-3 py-1">
                  {lang.name}
                  <span className="text-primary">{lang.percentage}%</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function MiniStatCard({
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
      <CardContent className="flex flex-col items-center justify-center p-4">
        <Icon className="mb-1 h-4 w-4 text-primary" />
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
