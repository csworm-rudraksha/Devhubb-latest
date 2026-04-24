"use client"

import { useEffect, useState } from "react"
import Editor, { OnChange, OnMount } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [mounted, setMounted] = useState(false)
  const editorRef = React.useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
  }

  const handleCodeChange: OnChange = (value) => {
    if (value !== undefined) {
      onCodeChange(value)
    }
  }

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-secondary/50">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  const selectedLanguage = LANGUAGES.find((l) => l.value === language)
  const fileExtension = selectedLanguage?.ext || "txt"

  return (
    <div className="flex flex-col gap-3">
      {/* Language selector */}
      <div className="flex items-center justify-between">
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
      <div className="rounded-lg border border-border overflow-hidden">
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={handleCodeChange}
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
          }}
        />
      </div>
    </div>
  )
}

// Re-export React for useRef
import React from "react"
