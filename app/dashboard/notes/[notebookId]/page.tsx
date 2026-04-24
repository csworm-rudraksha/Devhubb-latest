"use client"

import { use, useState, useEffect, useTransition } from "react"
import MDEditor from "@uiw/react-md-editor"
import { DUMMY_NOTEBOOKS, DUMMY_PAGES } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, FileText, Save, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { createNotebookPageAction, updatePageContentAction } from "@/app/actions/data"
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
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

interface NotebookPage {
  id: string
  title: string
  content: string
  updated_at: string
}

export default function NotebookDetailPage({
  params,
}: {
  params: Promise<{ notebookId: string }>
}) {
  const { notebookId } = use(params)
  const [notebookTitle, setNotebookTitle] = useState("")
  const [pages, setPages] = useState<NotebookPage[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [newPageTitle, setNewPageTitle] = useState("")
  const [newPageDialog, setNewPageDialog] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: notebook } = await supabase
          .from("notebooks")
          .select("*")
          .eq("id", notebookId)
          .single()

        if (notebook) {
          setNotebookTitle(notebook.title)
          const { data: pagesData } = await supabase
            .from("notebook_pages")
            .select("*")
            .eq("notebook_id", notebookId)
            .order("sort_order", { ascending: true })

          if (pagesData && pagesData.length > 0) {
            setPages(pagesData)
            setSelectedPageId(pagesData[0].id)
            setEditContent(pagesData[0].content || "")
            setLoading(false)
            return
          }

          setPages([])
          setLoading(false)
          return
        }
      }

      // Fallback to dummy
      const dummyNb = DUMMY_NOTEBOOKS.find((nb) => nb.id === notebookId)
      setNotebookTitle(dummyNb?.title || "Notebook")
      const dummyPages = DUMMY_PAGES[notebookId] || []
      const mapped = dummyPages.map((p) => ({
        id: p.id,
        title: p.title,
        content: p.contentMd,
        updated_at: p.updatedAt,
      }))
      setPages(mapped)
      if (mapped.length > 0) {
        setSelectedPageId(mapped[0].id)
        setEditContent(mapped[0].content)
      }
      setLoading(false)
    }
    fetchData()
  }, [notebookId])

  const selectedPage = pages.find((p) => p.id === selectedPageId)

  function handleSelectPage(pageId: string) {
    const page = pages.find((p) => p.id === pageId)
    if (page) {
      setSelectedPageId(pageId)
      setEditContent(page.content)
      setSaved(false)
    }
  }

  function handleSave() {
    if (!selectedPageId) return
    startTransition(async () => {
      await updatePageContentAction(selectedPageId, editContent)
      setPages((prev) =>
        prev.map((p) => (p.id === selectedPageId ? { ...p, content: editContent } : p))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  function handleCreatePage() {
    if (!newPageTitle.trim()) return
    startTransition(async () => {
      const result = await createNotebookPageAction(notebookId, newPageTitle.trim())
      if (result.data) {
        const newPage = {
          id: result.data.id,
          title: result.data.title,
          content: result.data.content || "",
          updated_at: result.data.updated_at,
        }
        setPages([...pages, newPage])
        setSelectedPageId(newPage.id)
        setEditContent("")
      }
      setNewPageTitle("")
      setNewPageDialog(false)
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading notebook...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{notebookTitle}</h1>
          <p className="text-sm text-muted-foreground">{pages.length} pages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Page list */}
        <div className="flex flex-col gap-2">
          <Dialog open={newPageDialog} onOpenChange={setNewPageDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 mb-2">
                <Plus className="h-4 w-4" />
                New Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Page</DialogTitle>
                <DialogDescription>Add a new page to this notebook.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input
                    id="pageTitle"
                    placeholder="My Page"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
                  />
                </div>
                <Button onClick={handleCreatePage} disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSelectPage(page.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                selectedPageId === page.id
                  ? "border-primary/30 bg-secondary"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{page.title}</p>
              </div>
            </button>
          ))}
          {pages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No pages yet</p>
          )}
        </div>

        {/* Page content */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            {selectedPage ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">{selectedPage.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Markdown</Badge>
                    <Button size="sm" className="gap-2" onClick={handleSave} disabled={isPending}>
                      {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
                <div data-color-mode="dark" className="rounded-lg overflow-hidden border border-border">
                  <MDEditor
                    value={editContent}
                    onChange={(val) => {
                      setEditContent(val || "")
                      setSaved(false)
                    }}
                    preview="edit"
                    height={400}
                    visibleDragbar={false}
                    textareaProps={{
                      spellCheck: false,
                    }}
                    className="rounded-lg"
                    style={{
                      backgroundColor: "hsl(var(--secondary))",
                      borderRadius: "calc(var(--radius) - 2px)",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <FileText className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a page to view its content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
