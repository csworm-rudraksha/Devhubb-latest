"use client"

import { use, useState, useEffect } from "react"
import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { RoomProvider } from "@liveblocks/react"
import { CollaborativeCodeEditor } from "@/components/collaborative-code-editor"
import { LiveblocksWrapper } from "@/components/liveblocks-provider"

interface Room {
  id: string
  name: string
  language: string
  code: string
}

function CodingRoomContent({ roomId, room }: { roomId: string; room: Room }) {
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/coding/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <p className="text-xs text-muted-foreground mt-1">
              Real-time collaborative editor powered by Liveblocks
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </Button>
        </div>
      </div>

      {/* Collaborative code editor */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <CollaborativeCodeEditor
          initialCode={room.code || "// Start coding...\n"}
          initialLanguage={room.language || "javascript"}
          roomId={roomId}
        />
      </div>
    </div>
  )
}

export default function CodingRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoom() {
      const supabase = createClient()

      try {
        // Try fetching from Supabase
        const { data } = await supabase
          .from("collab_rooms")
          .select("*")
          .eq("id", roomId)
          .single()

        if (data) {
          setRoom(data)
          setLoading(false)
          return
        }
      } catch (error) {
        console.log("Error fetching from Supabase, using dummy data")
      }

      // Fallback to dummy data
      const dummyRoom = DUMMY_COLLAB_ROOMS.find((r) => r.id === roomId)
      if (dummyRoom) {
        setRoom({
          id: dummyRoom.id,
          name: dummyRoom.title,
          language: dummyRoom.language,
          code: dummyRoom.content,
        })
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

  return (
    <LiveblocksWrapper>
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <CodingRoomContent roomId={roomId} room={room} />
      </RoomProvider>
    </LiveblocksWrapper>
  )
}
