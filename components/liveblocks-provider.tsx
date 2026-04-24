"use client"

import { ReactNode } from "react"
import { LiveblocksProvider } from "@liveblocks/react"
import { liveblocks } from "@/lib/liveblocks"

export function LiveblocksWrapper({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider client={liveblocks}>
      {children}
    </LiveblocksProvider>
  )
}
