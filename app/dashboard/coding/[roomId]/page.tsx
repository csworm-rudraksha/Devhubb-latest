"use client"

import { use, useState } from "react"
import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Copy, Save, Users, Check } from "lucide-react"
import Link from "next/link"

const PRESENCE_USERS = [
  { name: "Rudraksha S.", color: "bg-chart-1" },
  { name: "Aman K.", color: "bg-chart-2" },
  { name: "Priya M.", color: "bg-chart-4" },
]

export default function CodingRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = use(params)
  const room = DUMMY_COLLAB_ROOMS.find((r) => r.id === roomId)
  const [code, setCode] = useState(room?.content || "// Start coding...")
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Room not found</p>
        <Button variant="ghost" asChild className="mt-4">
          <Link href="/dashboard/coding">Back to Rooms</Link>
        </Button>
      </div>
    )
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://devhubb.io/join/${room!.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/coding">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{room.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">{room.language}</Badge>
              <span className="text-xs text-muted-foreground">Collaborative</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Presence avatars */}
          <div className="flex items-center gap-1">
            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {PRESENCE_USERS.map((u) => (
                <Avatar key={u.name} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className={`${u.color} text-xs text-primary-foreground`}>
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Share Link"}
          </Button>

          <Button size="sm" className="gap-2" onClick={handleSave}>
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        {/* Editor header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive/50" />
            <div className="h-3 w-3 rounded-full bg-chart-3/50" />
            <div className="h-3 w-3 rounded-full bg-chart-1/50" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{room.title}.java</span>
        </div>
        {/* Textarea simulating code editor */}
        <div className="flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div className="flex flex-col bg-secondary/50 py-4 pl-4 pr-3 text-right font-mono text-xs text-muted-foreground select-none">
            {code.split("\n").map((_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>
          {/* Code area */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-foreground leading-6 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
