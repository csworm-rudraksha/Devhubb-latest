"use server"

import { createClient } from "@/lib/supabase/server"

export async function createNotebookAction(title: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("notebooks")
    .insert({ user_id: user.id, title })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function createNotebookPageAction(notebookId: string, title: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("notebook_pages")
    .insert({ notebook_id: notebookId, user_id: user.id, title, content: "" })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function updatePageContentAction(pageId: string, content: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("notebook_pages")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", pageId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function createCollabRoomAction(name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("collab_rooms")
    .insert({ user_id: user.id, name, language: "javascript", code: "// Start coding...\n" })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function saveRoomCodeAction(roomId: string, code: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("collab_rooms")
    .update({ code, updated_at: new Date().toISOString() })
    .eq("id", roomId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function updateRoomLanguageAction(roomId: string, language: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("collab_rooms")
    .update({ language, updated_at: new Date().toISOString() })
    .eq("id", roomId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteNotebookAction(notebookId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("notebooks").delete().eq("id", notebookId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteRoomAction(roomId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("collab_rooms").delete().eq("id", roomId)

  if (error) return { error: error.message }
  return { success: true }
}
