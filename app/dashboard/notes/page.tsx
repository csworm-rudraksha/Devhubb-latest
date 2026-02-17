"use client"

import { DUMMY_NOTEBOOKS } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Clock } from "lucide-react"
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

export default function NotesPage() {
  const [notebooks, setNotebooks] = useState(DUMMY_NOTEBOOKS)
  const [newTitle, setNewTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  function createNotebook() {
    if (!newTitle.trim()) return
    const nb = {
      id: `nb-${Date.now()}`,
      title: newTitle.trim(),
      ownerId: "u-001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pageCount: 0,
    }
    setNotebooks([nb, ...notebooks])
    setNewTitle("")
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {notebooks.length} notebooks
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Notebook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Notebook</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="My Notebook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createNotebook()}
                />
              </div>
              <Button onClick={createNotebook}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notebooks.map((nb) => (
          <Link key={nb.id} href={`/dashboard/notes/${nb.id}`}>
            <Card className="group border-border bg-card transition-colors hover:border-primary/30">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {nb.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nb.pageCount} {nb.pageCount === 1 ? "page" : "pages"}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Updated{" "}
                    {new Date(nb.updatedAt).toLocaleDateString("en-US", {
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
