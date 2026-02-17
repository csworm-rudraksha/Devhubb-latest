"use client"

import { use, useState } from "react"
import { DUMMY_NOTEBOOKS, DUMMY_PAGES } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, FileText, Globe, Lock } from "lucide-react"
import Link from "next/link"

export default function NotebookDetailPage({
  params,
}: {
  params: Promise<{ notebookId: string }>
}) {
  const { notebookId } = use(params)
  const notebook = DUMMY_NOTEBOOKS.find((nb) => nb.id === notebookId)
  const pages = DUMMY_PAGES[notebookId] || []
  const [selectedPageId, setSelectedPageId] = useState<string | null>(
    pages.length > 0 ? pages[0].id : null
  )

  const selectedPage = pages.find((p) => p.id === selectedPageId)

  if (!notebook) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Notebook not found</p>
        <Button variant="ghost" asChild className="mt-4">
          <Link href="/dashboard/notes">Back to Notes</Link>
        </Button>
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
          <h1 className="text-xl font-bold text-foreground">{notebook.title}</h1>
          <p className="text-sm text-muted-foreground">{pages.length} pages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Page list */}
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full gap-2 mb-2">
            <Plus className="h-4 w-4" />
            New Page
          </Button>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                selectedPageId === page.id
                  ? "border-primary/30 bg-secondary"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{page.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  {page.isPublic ? (
                    <Badge variant="secondary" className="gap-1 text-xs bg-primary/10 text-primary">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </div>
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
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">{selectedPage.title}</h2>
                  <Badge variant="outline" className="text-xs">Markdown</Badge>
                </div>
                <div className="prose prose-invert max-w-none">
                  <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedPage.contentMd}
                  </pre>
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
