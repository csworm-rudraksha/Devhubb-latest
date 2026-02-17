"use client"

import { DUMMY_COLLAB_ROOMS } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CodingPage() {
  const [rooms, setRooms] = useState(DUMMY_COLLAB_ROOMS)
  const [newTitle, setNewTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  function createRoom() {
    if (!newTitle.trim()) return
    const room = {
      id: `rm-${Date.now()}`,
      ownerId: "u-001",
      title: newTitle.trim(),
      slug: newTitle.trim().toLowerCase().replace(/\s+/g, "-"),
      language: "java",
      participantCount: 1,
      lastSavedAt: new Date().toISOString(),
      content: "// Start coding here...\n",
    }
    setRooms([room, ...rooms])
    setNewTitle("")
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coding Rooms</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rooms.length} rooms - Real-time collaborative Java editor
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
              <Button onClick={createRoom}>Create Room</Button>
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
                  {room.title}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {room.participantCount} online
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(room.lastSavedAt).toLocaleDateString("en-US", {
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
