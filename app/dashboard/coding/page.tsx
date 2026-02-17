"use client"

import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createCollabRoomAction } from "@/app/actions/data"

interface CollabRoom {
  id: string
  name: string
  language: string
  created_at: string
  updated_at: string
}

export default function CodingPage() {
  const [rooms, setRooms] = useState<CollabRoom[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchRooms() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("collab_rooms")
          .select("*")
          .order("updated_at", { ascending: false })

        if (data && data.length > 0) {
          setRooms(data)
          setLoading(false)
          return
        }
      }

      // Fallback to dummy data
      setRooms(
        DUMMY_COLLAB_ROOMS.map((r) => ({
          id: r.id,
          name: r.title,
          language: r.language,
          created_at: r.lastSavedAt,
          updated_at: r.lastSavedAt,
        }))
      )
      setLoading(false)
    }
    fetchRooms()
  }, [])

  function createRoom() {
    if (!newTitle.trim()) return
    startTransition(async () => {
      const result = await createCollabRoomAction(newTitle.trim())
      if (result.data) {
        setRooms([result.data, ...rooms])
      }
      setNewTitle("")
      setDialogOpen(false)
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coding Rooms</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coding Rooms</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rooms.length} rooms - Real-time collaborative editor
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="roomTitle">Room title</Label>
                <Input
                  id="roomTitle"
                  placeholder="My Project"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createRoom()}
                />
              </div>
              <Button onClick={createRoom} disabled={isPending}>
                {isPending ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link key={room.id} href={`/dashboard/coding/${room.id}`}>
            <Card className="group border-border bg-card transition-colors hover:border-primary/30">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {room.language}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Updated{" "}
                    {new Date(room.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
