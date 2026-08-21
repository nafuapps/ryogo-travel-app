"use server"

import { updateCurrentUser } from "@/lib/auth"

export async function refreshUserSessionAction() {
  await updateCurrentUser()
}
