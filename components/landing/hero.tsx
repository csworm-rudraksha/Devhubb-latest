import Link from "next/link"
import { ArrowRight, Github, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Built for developers, by developers
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Your single-stop
          <span className="text-primary"> developer </span>
          platform
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Track your GitHub and LeetCode stats, organize notes in Markdown, collaborate on code in real-time, and share your developer profile with the world.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild className="gap-2">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard/overview">
              View Demo Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Github className="h-5 w-5" />}
            title="Unified Stats"
            description="GitHub repos, stars, commits & LeetCode progress in one view"
          />
          <FeatureCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Markdown Notes"
            description="Organize your knowledge in notebooks with rich Markdown editing"
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Live Collaboration"
            description="Real-time Java editor with live cursors and presence"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/30 hover:bg-secondary">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
