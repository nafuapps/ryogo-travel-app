"use server"

import { getCurrentUser, logout } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const user = await logout()
  if (!user) {
    return
  }
  redirect("/auth/login", RedirectType.replace)
}
