"use client"

import { use, useState, useEffect, useTransition } from "react"
import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Copy, Save, Users, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { saveRoomCodeAction, updateRoomLanguageAction } from "@/app/actions/data"
import { CodeEditor } from "@/components/code-editor"

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
  const [language, setLanguage] = useState("javascript")
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
          setLanguage(data.language || "javascript")
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
        setLanguage(dummyRoom.language)
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

  function handleLanguageChange(newLanguage: string) {
    setLanguage(newLanguage)
    startTransition(async () => {
      await updateRoomLanguageAction(roomId, newLanguage)
    })
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/coding">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{room.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-mono text-xs">{language}</Badge>
              <span className="text-xs text-muted-foreground">Real-time Editor</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </Button>

          <Button size="sm" className="gap-2" onClick={handleSave} disabled={isPending}>
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{saved ? "Saved" : isPending ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <CodeEditor
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={handleLanguageChange}
          height="100%"
          roomName={room.name}
        />
      </div>
    </div>
  )
}
