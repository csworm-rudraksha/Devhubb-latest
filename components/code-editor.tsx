"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dynamically import Monaco Editor without SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-lg border border-border bg-secondary/50">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
})

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", ext: "js" },
  { value: "typescript", label: "TypeScript", ext: "ts" },
  { value: "python", label: "Python", ext: "py" },
  { value: "java", label: "Java", ext: "java" },
  { value: "cpp", label: "C++", ext: "cpp" },
  { value: "csharp", label: "C#", ext: "cs" },
  { value: "golang", label: "Go", ext: "go" },
  { value: "rust", label: "Rust", ext: "rs" },
  { value: "php", label: "PHP", ext: "php" },
  { value: "ruby", label: "Ruby", ext: "rb" },
  { value: "sql", label: "SQL", ext: "sql" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "css", label: "CSS", ext: "css" },
  { value: "json", label: "JSON", ext: "json" },
  { value: "xml", label: "XML", ext: "xml" },
  { value: "yaml", label: "YAML", ext: "yaml" },
  { value: "markdown", label: "Markdown", ext: "md" },
  { value: "bash", label: "Bash", ext: "sh" },
]

interface CodeEditorProps {
  code: string
  language: string
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  readOnly?: boolean
  height?: string
  roomName?: string
}

export function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  readOnly = false,
  height = "400px",
  roomName = "untitled",
}: CodeEditorProps) {
  const editorRef = React.useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor
  }

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-secondary/50">
        <p className="text-muted-foreground">Initializing editor...</p>
      </div>
    )
  }

  const selectedLanguage = LANGUAGES.find((l) => l.value === language)
  const fileExtension = selectedLanguage?.ext || "txt"

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Language selector */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Language:</span>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40">
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
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {roomName}.{fileExtension}
        </span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            readOnly: readOnly,
            formatOnPaste: true,
            formatOnType: true,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  )
}
