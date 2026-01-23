//(Onboarding) Add driver page

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import AddDriverPageComponent from "./addDriver"
import { Metadata } from "next"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: "Add Driver Page | RyoGo",
  description: "Add Driver page for RyoGo Travel App",
}

export default async function AddDriverPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Not owner
  if (currentUser.userRole != UserRolesEnum.OWNER) {
    if (currentUser.status == UserStatusEnum.NEW) {
      //If new, go to change password
      redirect("/onboarding/change-password", RedirectType.replace)
    }
    //Not new users
    if (currentUser.userRole == UserRolesEnum.DRIVER) {
      //If driver, go to rider page
      redirect("/rider", RedirectType.replace)
    }
    //Else, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Owner
  if (currentUser.status != UserStatusEnum.NEW) {
    //If not new, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Only new owners can add driver
  return (
    <AddDriverPageComponent
      agencyId={currentUser.agencyId}
      userId={currentUser.userId}
      userStatus={currentUser.status}
    />
  )
}
