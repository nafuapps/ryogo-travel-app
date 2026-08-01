"use server"

import { getCurrentUser, logout, verifyCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  await logout()
  redirect("/auth/login", RedirectType.replace)
}
