"use client"

import { DUMMY_USER } from "@/lib/dummy-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardTopbar() {
  const initials = DUMMY_USER.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{DUMMY_USER.fullName}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
