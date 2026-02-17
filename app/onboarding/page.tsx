"use client"

import { useState, useTransition } from "react"
import { Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { saveOnboardingAction } from "@/app/actions/auth"

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await saveOnboardingAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DevHubb</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Set up your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tell us about yourself so others can find you</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" placeholder="Rudraksha Sharma" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="handle">Handle</Label>
              <Input id="handle" name="handle" placeholder="rudraksha" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="college">College / Company</Label>
              <Input id="college" name="college" placeholder="IIT Delhi" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="New Delhi" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" placeholder="A few words about yourself..." rows={3} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/username" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="twitterUrl">Twitter / X URL</Label>
              <Input id="twitterUrl" name="twitterUrl" placeholder="https://twitter.com/..." />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" placeholder="+91 98765 43210" />
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  )
}
