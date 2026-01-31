"use server"

import { logout } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  const user = await logout()
  if (!user) return
  redirect("/auth/login", RedirectType.replace)
}
