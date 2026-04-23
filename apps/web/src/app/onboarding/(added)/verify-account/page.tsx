//(Onboarding) Add vehicle page

import { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import VerifyAccountPageComponent from "./verifyAccount"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: "Onboarding Verify Account - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function VerifyAccountPage() {
  const currentUser = await getCurrentUser()
  //If not logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Not owner
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    if (currentUser.status === UserStatusEnum.NEW) {
      //If new, go to change password
      redirect("/onboarding/change-password", RedirectType.replace)
    }
    //Not new users
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      //If driver, go to rider page
      redirect("/rider", RedirectType.replace)
    }
    //Else, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Owner
  if (currentUser.status !== UserStatusEnum.NEW) {
    //If already activated, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //If owner already verified
  if (currentUser.isVerified) {
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  return <VerifyAccountPageComponent updatedAt={userDetails?.updatedAt} />
}
