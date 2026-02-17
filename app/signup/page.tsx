"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { Code2, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupAction } from "@/app/actions/auth"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSignup(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await signupAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  async function handleGitHubLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DevHubb</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join the developer community</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" placeholder="Rudraksha Sharma" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Min 8 characters" required minLength={6} />
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full gap-2" onClick={handleGitHubLogin}>
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
