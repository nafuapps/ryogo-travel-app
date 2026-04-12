"use server"

import { getCurrentUser, logout } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  await logout()
  redirect("/auth/login", RedirectType.replace)
}
