"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function OnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: "",
    handle: "",
    college: "",
    city: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    phone: "",
  })

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push("/dashboard/overview")
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Rudraksha Sharma" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="handle">Handle</Label>
              <Input id="handle" placeholder="rudraksha" value={form.handle} onChange={(e) => update("handle", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="college">College / Company</Label>
              <Input id="college" placeholder="IIT Delhi" value={form.college} onChange={(e) => update("college", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New Delhi" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A few words about yourself..." value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" placeholder="https://github.com/username" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="twitterUrl">Twitter / X URL</Label>
              <Input id="twitterUrl" placeholder="https://twitter.com/..." value={form.twitterUrl} onChange={(e) => update("twitterUrl", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>

          <Button type="submit" className="mt-4 w-full">
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  )
}
