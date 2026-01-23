"use server"

import { logout } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export async function logoutAction() {
  await logout()
  redirect("/auth/login", RedirectType.replace)
}
