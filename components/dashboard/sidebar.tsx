"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Code2,
  BarChart3,
  FileText,
  Code,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { signOutAction } from "@/app/actions/auth"
import { useSidebar } from "@/lib/sidebar-context"

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/notes", label: "Notes", icon: FileText },
  { href: "/dashboard/coding", label: "Coding", icon: Code },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-200 md:static md:z-auto",
          collapsed ? "md:w-16" : "md:w-60",
          mobileOpen ? "w-60 translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {(!collapsed || mobileOpen) && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Code2 className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-sidebar-foreground">DevHubb</span>
            </Link>
          )}
          {collapsed && !mobileOpen && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Code2 className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
          )}
          {/* Mobile close button */}
          <button
            className="ml-auto md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
          <Button
            variant="ghost"
            className={cn(
              "mt-1 w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground",
              collapsed && !mobileOpen && "md:justify-center md:px-0"
            )}
            disabled={isPending}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>{isPending ? "Signing out..." : "Log out"}</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
