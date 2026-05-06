"use server"

import { login, getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect } from "next/navigation"

//Forgot password reset flow
export async function setNewPasswordAction(userId: string, password: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider")
    } else {
      redirect("/dashboard")
    }
  }

  const user = await userServices.changeNewPassword(userId, password)
  if (!user) return

  await login(user.id, password)

  return user
}
