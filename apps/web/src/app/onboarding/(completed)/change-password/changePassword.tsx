"use client"

import { useTranslations } from "next-intl"
import {
  OnboardingStepHeader,
  OnboardingStepPage,
} from "@/components/flows/onboarding/onboardingSteps"
import { ChangePasswordStep1 } from "./changePasswordStep1"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"

export default function ChangePasswordPageComponent(props: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const t = useTranslations("Onboarding.ChangePasswordPage")

  return (
    <>
      <OnboardingStepPage pageId="ChangePassword">
        <OnboardingStepHeader
          headerId="ChangePasswordHeader"
          title={t("Title")}
          stepLabel={t("Subtitle")}
        />

        <ChangePasswordStep1
          userId={props.userId}
          role={props.role}
          agencyId={props.agencyId}
        />
      </OnboardingStepPage>
      <OnboardingSidebar showLogout />
    </>
  )
}
