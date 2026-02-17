"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/overview")
}

export async function signupAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("name") as string
  const handle = fullName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 100)

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "https://" + new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.replace(".supabase.co", ".vercel.app") : ""}/dashboard/overview`,
      data: {
        full_name: fullName,
        handle,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/signup/success")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const updates: Record<string, unknown> = {}
  const fields = [
    "full_name",
    "handle",
    "college",
    "city",
    "bio",
    "github_url",
    "linkedin_url",
    "twitter_url",
    "phone_number",
  ]

  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null) {
      updates[field] = value as string
    }
  }

  updates.updated_at = new Date().toISOString()

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateProfileVisibilityAction(isPublic: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function saveOnboardingAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("profiles").update({
    full_name: formData.get("fullName") as string,
    handle: formData.get("handle") as string,
    college: formData.get("college") as string,
    city: formData.get("city") as string,
    bio: formData.get("bio") as string,
    github_url: formData.get("githubUrl") as string,
    linkedin_url: formData.get("linkedinUrl") as string,
    twitter_url: formData.get("twitterUrl") as string,
    phone_number: formData.get("phone") as string,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/overview")
}
