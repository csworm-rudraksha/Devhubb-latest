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
import { useState } from "react"

export default function ProfilePage() {
  const user = DUMMY_USER
  const [isPublic, setIsPublic] = useState(user.isPublic)
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://devhubb.io/u/${user.handle}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <Link href={`/u/${user.handle}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Public Page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Profile details card */}
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
              {/* Avatar and name row */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-lg text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{user.fullName}</h2>
                  <p className="text-sm text-primary">@{user.handle}</p>
                </div>
              </div>

              {editing ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>Full name</Label>
                      <Input defaultValue={user.fullName} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Handle</Label>
                      <Input defaultValue={user.handle} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bio</Label>
                    <Textarea defaultValue={user.bio} rows={3} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>College / Company</Label>
                      <Input defaultValue={user.college} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>City</Label>
                      <Input defaultValue={user.city} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>GitHub URL</Label>
                    <Input defaultValue={user.githubUrl} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>LinkedIn URL</Label>
                      <Input defaultValue={user.linkedinUrl} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Twitter URL</Label>
                      <Input defaultValue={user.twitterUrl} />
                    </div>
                  </div>
                  <Button className="self-start" onClick={() => setEditing(false)}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {user.college}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {user.city}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="gap-1.5">
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Twitter className="h-3.5 w-3.5" />
                      Twitter
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right sidebar: visibility + stats summary */}
        <div className="flex flex-col gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Public Profile</p>
                  <p className="text-xs text-muted-foreground">Visible at /u/{user.handle}</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
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
