"use server"
import { getCurrentUser, login } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function loginAction(userId: string, password: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }
  const loginStatus = await login(userId, password)
  return loginStatus
}
