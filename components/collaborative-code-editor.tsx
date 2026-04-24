"use client"

import { useEffect, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { useRoom, useMyPresence, useOthers } from "@liveblocks/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateRoomLanguageAction } from "@/app/actions/data"
import { Users, Save } from "lucide-react"

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-full bg-secondary animate-pulse" /> }
)

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
]

interface CollaborativeEditorProps {
  initialCode: string
  initialLanguage: string
  roomId: string
}

export function CollaborativeCodeEditor({
  initialCode,
  initialLanguage,
  roomId,
}: CollaborativeEditorProps) {
  const room = useRoom()
  const others = useOthers()
  const [, setMyPresence] = useMyPresence()
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [isSaving, setIsSaving] = useState(false)
  const [, startTransition] = useTransition()

  // Sync presence - show cursor position
  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ""
    setCode(newCode)
    setMyPresence({ cursor: { x: 0, y: 0 }, selectedText: newCode.substring(0, 10) })
  }

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage)
    setIsSaving(true)
    startTransition(async () => {
      await updateRoomLanguageAction(roomId, newLanguage)
      setIsSaving(false)
    })
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header with language selector and collaborators */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Language:</label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isSaving && <span className="text-xs text-muted-foreground">Syncing...</span>}
        </div>

        {/* Live collaborators indicator */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">
            {others.length > 0
              ? `${others.length} editing live`
              : "You're editing alone"}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 rounded-lg border border-border overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "Fira Code, Courier New",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            bracketPairColorization: {
              enabled: true,
            },
          }}
        />
      </div>

      {/* Collaborators list */}
      {others.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active collaborators:</span>
          <div className="flex gap-1">
            {others.map((other) => (
              <div
                key={other.connectionId}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `hsl(${(other.connectionId * 137.5) % 360}, 70%, 50%)`,
                  }}
                />
                <span className="text-xs">User {other.connectionId}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
