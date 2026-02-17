import { Code2, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">DevHubb</span>
        </Link>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent you a confirmation link. Click it to activate your account and start using DevHubb.
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
