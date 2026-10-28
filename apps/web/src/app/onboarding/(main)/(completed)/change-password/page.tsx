//New agent/driver/added owner logging in for the first time

import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import { ChangePasswordStepComponent } from "./changePasswordStep"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

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
    //Non owner
    if (currentUser.isVerified) {
      if (currentUser.userRole === UserRolesEnum.DRIVER) {
        //If driver, go to rider home
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
      <OnboardingPageWrapper id="ChangePassword">
        <OnboardingStepHeader
          title={t("Title")}
          stepLabel={t("Subtitle")}
          totalSteps={1}
          currentStepIndex={0}
          href={"https://www.youtube.com/watch?v=VHx9u4dFULs"}
        />
        <ChangePasswordStepComponent
          userId={currentUser.userId}
          role={currentUser.userRole}
          agencyId={currentUser.agencyId}
        />
      </OnboardingPageWrapper>
      <OnboardingSidebar showLogout />
    </>
  )
}
