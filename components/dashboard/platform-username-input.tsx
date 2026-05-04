"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PlatformUsernameInputProps {
  platform: "github" | "leetcode" | "hackerrank" | "codechef"
  label: string
  placeholder: string
  currentValue: string | null
  onSave: (value: string) => Promise<void>
}

export function PlatformUsernameInput({
  platform,
  label,
  placeholder,
  currentValue,
  onSave,
}: PlatformUsernameInputProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentValue ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(value.trim())
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">
          {currentValue ? (
            <span className="text-muted-foreground">{currentValue}</span>
          ) : (
            <span className="text-xs text-muted-foreground">Not set</span>
          )}
        </div>
        <button
          onClick={() => {
            setValue(currentValue ?? "")
            setEditing(true)
          }}
          className="text-xs text-primary underline underline-offset-2 hover:no-underline"
        >
          {currentValue ? "Edit" : `Add ${label}`}
        </button>
        {saved && <span className="text-xs text-green-600">Saved!</span>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-7 text-sm w-48"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave()
          if (e.key === "Escape") setEditing(false)
        }}
        autoFocus
      />
      <Button
        onClick={handleSave}
        disabled={saving}
        size="sm"
        className="h-7 text-xs"
      >
        {saving ? "Saving..." : "Save"}
      </Button>
      <button
        onClick={() => setEditing(false)}
        className="text-xs text-muted-foreground"
      >
        Cancel
      </button>
    </div>
  )
}
