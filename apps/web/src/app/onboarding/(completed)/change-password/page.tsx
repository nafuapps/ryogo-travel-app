//New agent/driver/added owner logging in for the first time

import { getCurrentUser } from "@/lib/auth"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import {
  OnboardingStepHeader,
  OnboardingStepPage,
} from "@/components/flows/onboarding/onboardingSteps"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { getTranslations } from "next-intl/server"
import { ChangePasswordStepComponent } from "./changePasswordStep"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  // Owner
  if (currentUser.userRole === UserRolesEnum.OWNER) {
    if (currentUser.status === UserStatusEnum.NEW) {
      //This is the creator owner, need to verify and continue onboarding
      if (currentUser.isAdmin) {
        if (!currentUser.isVerified) {
          redirect("/onboarding/verify-account", RedirectType.replace)
        }
        //Verified new owner, go to vehicle onboarding
        redirect("/onboarding/add-vehicle", RedirectType.replace)
      }
      //Otherwise, it is an added owner, must continue to change password
    } else {
      //Activated owner, go to dashboard
      redirect("/dashboard/home", RedirectType.replace)
    }
  } else {
    // Active non-owner
    if (currentUser.status !== UserStatusEnum.NEW) {
      if (currentUser.userRole === UserRolesEnum.DRIVER) {
        //If driver, go to rider
        redirect("/rider/home", RedirectType.replace)
      } else {
        //If not driver, go to dashboard
        redirect("/dashboard/home", RedirectType.replace)
      }
    }
  }

  const t = await getTranslations("Onboarding.ChangePasswordPage")

  //Only new users can come to change password page
  return (
    <>
      <OnboardingStepPage pageId="ChangePassword">
        <OnboardingStepHeader
          headerId="ChangePasswordHeader"
          title={t("Title")}
          stepLabel={t("Subtitle")}
        />

        <ChangePasswordStepComponent
          userId={currentUser.userId}
          role={currentUser.userRole}
          agencyId={currentUser.agencyId}
        />
      </OnboardingStepPage>
      <OnboardingSidebar showLogout />
    </>
  )
}
