"use server"

import { getCurrentUser, logout, verifyCurrentUser } from "@/lib/auth"

export async function logoutAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  await logout()
}
