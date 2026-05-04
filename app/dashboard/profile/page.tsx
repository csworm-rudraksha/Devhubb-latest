"use client"

import { DUMMY_USER, DUMMY_GITHUB_STATS, DUMMY_LEETCODE_STATS } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Building2,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { updateProfileAction, updateProfileVisibilityAction } from "@/app/actions/auth"

interface Profile {
  full_name: string
  handle: string
  college: string
  city: string
  bio: string
  github_url: string
  leetcode_username: string
  linkedin_url: string
  twitter_url: string
  phone_number: string
  is_public: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [leetcodeUsername, setLeetcodeUsername] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, handle, college, city, bio, github_url, linkedin_url, twitter_url, phone_number, is_public, leetcode_username")
          .eq("id", user.id)
          .single()

        if (data) {
          setProfile({
            full_name: data.full_name,
            handle: data.handle,
            college: data.college,
            city: data.city,
            bio: data.bio,
            github_url: data.github_url,
            linkedin_url: data.linkedin_url,
            twitter_url: data.twitter_url,
            phone_number: data.phone_number,
            is_public: data.is_public,
            leetcode_username: data.leetcode_username,
          })
          setIsPublic(data.is_public ?? true)
          setLeetcodeUsername(data?.leetcode_username ?? "")
          setLoading(false)
          return
        }
      }

      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading || !profile) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const initials = (profile.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/u/${profile!.handle}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSaveProfile(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfileAction(formData, leetcodeUsername)
      if (result.success) {
        setProfile({
          ...profile!,
          full_name: formData.get("full_name") as string,
          handle: formData.get("handle") as string,
          college: formData.get("college") as string,
          city: formData.get("city") as string,
          bio: formData.get("bio") as string,
          github_url: formData.get("github_url") as string,
          leetcode_username: leetcodeUsername,
          linkedin_url: formData.get("linkedin_url") as string,
          twitter_url: formData.get("twitter_url") as string,
        })
        setEditing(false)
      }
    })
  }

  function handleTogglePublic(checked: boolean) {
    setIsPublic(checked)
    startTransition(async () => {
      await updateProfileVisibilityAction(checked)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your developer profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Share Profile"}
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href={`/u/${profile.handle}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Public Page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-border bg-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Profile Details</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-lg text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{profile.full_name}</h2>
                  <p className="text-sm text-primary">@{profile.handle}</p>
                </div>
              </div>

              {editing ? (
                <form action={handleSaveProfile} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>Full name</Label>
                      <Input name="full_name" defaultValue={profile.full_name} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Handle</Label>
                      <Input name="handle" defaultValue={profile.handle} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bio</Label>
                    <Textarea name="bio" defaultValue={profile.bio || ""} rows={3} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>College / Company</Label>
                      <Input name="college" defaultValue={profile.college || ""} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>City</Label>
                      <Input name="city" defaultValue={profile.city || ""} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>GitHub URL</Label>
                    <Input name="github_url" defaultValue={profile.github_url || ""} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>LeetCode Username</Label>
                    <Input
                      value={leetcodeUsername}
                      onChange={(e) => setLeetcodeUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>LinkedIn URL</Label>
                      <Input name="linkedin_url" defaultValue={profile.linkedin_url || ""} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Twitter URL</Label>
                      <Input name="twitter_url" defaultValue={profile.twitter_url || ""} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input name="phone_number" defaultValue={profile.phone_number || ""} />
                  </div>
                  <Button type="submit" className="self-start" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio || "No bio yet"}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profile.college && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {profile.college}
                      </span>
                    )}
                    {profile.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {profile.city}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {profile.github_url && (
                      <Badge variant="secondary" className="gap-1.5">
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                      </Badge>
                    )}
                    {profile.linkedin_url && (
                      <Badge variant="secondary" className="gap-1.5">
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </Badge>
                    )}
                    {profile.twitter_url && (
                      <Badge variant="secondary" className="gap-1.5">
                        <Twitter className="h-3.5 w-3.5" />
                        Twitter
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Public Profile</p>
                  <p className="text-xs text-muted-foreground">Visible at /u/{profile.handle}</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GitHub Repos</span>
                  <span className="font-medium text-foreground">{DUMMY_GITHUB_STATS.publicRepos}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GitHub Stars</span>
                  <span className="font-medium text-foreground">{DUMMY_GITHUB_STATS.totalStars.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">LeetCode Solved</span>
                  <span className="font-medium text-foreground">{DUMMY_LEETCODE_STATS.totalSolved}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contest Rating</span>
                  <span className="font-medium text-foreground">{DUMMY_LEETCODE_STATS.contestRating}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-medium text-foreground">{DUMMY_LEETCODE_STATS.streak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
