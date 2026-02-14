//New agent loggin in for the first time or existing user resetting password

import { getCurrentUser } from "@/lib/auth"
import ChangePasswordPageComponent from "./changePassword"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  // Owner
  if (currentUser.userRole === UserRolesEnum.OWNER) {
    if (currentUser.status === UserStatusEnum.NEW) {
      //If new owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace)
    }
    // Old owner, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  // Old user
  if (currentUser.status !== UserStatusEnum.NEW) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      //If driver, go to rider
      redirect("/rider", RedirectType.replace)
    } else {
      //If not driver, go to dashboard
      redirect("/dashboard", RedirectType.replace)
    }
  }

  //Only new non owners can come to change password page
  return (
    <ChangePasswordPageComponent
      userId={currentUser.userId}
      role={currentUser.userRole}
      agencyId={currentUser.agencyId}
    />
  )
}
