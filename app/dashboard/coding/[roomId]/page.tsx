"use client"

import { use, useState, useEffect, useTransition } from "react"
import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Copy, Save, Users, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { saveRoomCodeAction } from "@/app/actions/data"

const PRESENCE_USERS = [
  { name: "You", color: "bg-chart-1" },
]

interface Room {
  id: string
  name: string
  language: string
  code: string
}

export default function CodingRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [code, setCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchRoom() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("collab_rooms")
          .select("*")
          .eq("id", roomId)
          .single()

        if (data) {
          setRoom(data)
          setCode(data.code || "// Start coding...\n")
          setLoading(false)
          return
        }
      }

      // Fallback to dummy
      const dummyRoom = DUMMY_COLLAB_ROOMS.find((r) => r.id === roomId)
      if (dummyRoom) {
        setRoom({
          id: dummyRoom.id,
          name: dummyRoom.title,
          language: dummyRoom.language,
          code: dummyRoom.content,
        })
        setCode(dummyRoom.content)
      }
      setLoading(false)
    }
    fetchRoom()
  }, [roomId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading room...</p>
      </div>
    )
  }

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
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/coding/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSave() {
    startTransition(async () => {
      await saveRoomCodeAction(roomId, code)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
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
            <h1 className="text-lg font-bold text-foreground">{room.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">{room.language}</Badge>
              <span className="text-xs text-muted-foreground">Collaborative</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

          <Button size="sm" className="gap-2" onClick={handleSave} disabled={isPending}>
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive/50" />
            <div className="h-3 w-3 rounded-full bg-chart-3/50" />
            <div className="h-3 w-3 rounded-full bg-chart-1/50" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{room.name}.{room.language === "javascript" ? "js" : room.language}</span>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col bg-secondary/50 py-4 pl-4 pr-3 text-right font-mono text-xs text-muted-foreground select-none">
            {code.split("\n").map((_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => { setCode(e.target.value); setSaved(false) }}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-foreground leading-6 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
