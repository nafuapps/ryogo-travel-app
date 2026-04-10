"use client"

import { H2, H5Grey } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/app/onboarding/components/onboardingSteps"
import { ChangePasswordStep1 } from "./changePasswordStep1"
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import RyoGoLogo from "@/components/logo"

type ChangePasswordPageComponentProps = {
  userId: string
  agencyId: string
  role: UserRolesEnum
}
export default function ChangePasswordPageComponent(
  props: ChangePasswordPageComponentProps,
) {
  const t = useTranslations("Onboarding.ChangePasswordPage")
  const { isMobile } = useSidebar()

  return (
    <>
      <OnboardingStepPage pageId="ChangePassword">
        <OnboardingStepHeader headerId="ChangePasswordHeader">
          <OnboardingStepHeaderTopLine>
            <H2>{t("Title")}</H2>
          </OnboardingStepHeaderTopLine>
        </OnboardingStepHeader>
        <H5Grey>{t("Subtitle")}</H5Grey>
        <ChangePasswordStep1
          userId={props.userId}
          role={props.role}
          agencyId={props.agencyId}
        />
      </OnboardingStepPage>
      <Sidebar side="right" collapsible={isMobile ? "offcanvas" : "none"}>
        <SidebarContent>
          <div
            id="SidebarSection"
            className="w-full flex px-8 py-10 md:p-12 lg:p-16 h-full flex-col items-center justify-center gap-8 lg:gap-10 bg-slate-50"
          >
            <RyoGoLogo />
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
