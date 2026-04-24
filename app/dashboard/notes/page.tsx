"use client"

import { DUMMY_NOTEBOOKS } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createNotebookAction } from "@/app/actions/data"

interface Notebook {
  id: string
  title: string
  emoji: string
  created_at: string
  updated_at: string
  page_count?: number
}

export default function NotesPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchNotebooks() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("notebooks")
          .select("*")
          .order("updated_at", { ascending: false })

        if (data && data.length > 0) {
          setNotebooks(data)
          setLoading(false)
          return
        }
      }

      // Fallback to dummy data
      setNotebooks(
        DUMMY_NOTEBOOKS.map((nb) => ({
          id: nb.id,
          title: nb.title,
          emoji: "📓",
          created_at: nb.createdAt,
          updated_at: nb.updatedAt,
          page_count: nb.pageCount,
        }))
      )
      setLoading(false)
    }
    fetchNotebooks()
  }, [])

  function createNotebook() {
    if (!newTitle.trim()) return
    startTransition(async () => {
      const result = await createNotebookAction(newTitle.trim())
      if (result.data) {
        setNotebooks([result.data, ...notebooks])
      }
      setNewTitle("")
      setDialogOpen(false)
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
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
              <DialogDescription>Create a new notebook to organize your notes.</DialogDescription>
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
              <Button onClick={createNotebook} disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
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
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span suppressHydrationWarning>
                    Updated{" "}
                    {new Date(nb.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: new Date(nb.updated_at).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
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
