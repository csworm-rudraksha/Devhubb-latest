import { BarChart3, FileText, Code, Share2, Terminal, Zap } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "GitHub & LeetCode Stats",
    description: "Aggregated developer metrics from GitHub and LeetCode in real-time dashboard cards and charts.",
  },
  {
    icon: FileText,
    title: "Markdown Notebooks",
    description: "Create notebooks, write pages in GFM Markdown with syntax highlighting and sanitized preview.",
  },
  {
    icon: Code,
    title: "Collaborative Code Editor",
    description: "Real-time Java editor powered by CodeMirror 6 with live cursors, presence, and room sharing.",
  },
  {
    icon: Share2,
    title: "Shareable Profile",
    description: "Public developer profile with social links, stats summary, and OG image for link previews.",
  },
  {
    icon: Terminal,
    title: "Developer-First",
    description: "Built with Next.js, TypeScript, and Tailwind. Clean code, server components, and edge-ready.",
  },
  {
    icon: Zap,
    title: "Fast & Secure",
    description: "RSC streaming, cookie-based auth, RLS policies, input validation with Zod, and rate limiting.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-card/50 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            DevHubb brings together the tools developers use daily into a single, beautiful, minimal workspace.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
