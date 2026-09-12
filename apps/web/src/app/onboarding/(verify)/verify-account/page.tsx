//(Onboarding) Add vehicle page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import VerifyAccountPageComponent from "./verifyAccount"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export const metadata: Metadata = {
  title: `Onboarding Verify Account - ${pageTitle}`,
  description: pageDescription,
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
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      //If driver, go to rider home
      redirect("/rider/home", RedirectType.replace)
    }
    //Else, go to dashboard home
    redirect("/dashboard/home", RedirectType.replace)
  }

  //If owner already activated, go to dashboard
  if (currentUser.status !== UserStatusEnum.NEW) {
    redirect("/dashboard/home", RedirectType.replace)
  }

  //If owner already verified, continue onboarding
  if (currentUser.isVerified) {
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  if (!userDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <VerifyAccountPageComponent
      code={userDetails.verificationCode}
      codeSentAt={userDetails.codeSentAt}
    />
  )
}
