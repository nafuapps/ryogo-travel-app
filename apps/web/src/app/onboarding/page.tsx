//Onboarding home page

import { H2, PBold, SmallGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  AtSign,
  Building2,
  Camera,
  Car,
  FileText,
  FingerprintPattern,
  IdCard,
  LifeBuoy,
  UserKey,
} from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import OnboardingHomeStepItem from "./components/onboardingHomeStepItem"
import OnboardingHomeDocumentItem from "./components/onboardingHomeDocumentItem"
import RyoGoLogo from "@/components/logo"

export const metadata: Metadata = {
  title: "Onboarding Page | RyoGo",
  description: "Onboarding page for RyoGo Travel App",
}

export default async function OnboardingHomePage() {
  const user = await getCurrentUser()

  // Redirect to private route if the user is authenticated
  if (user) {
    if (user.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }
  const t = await getTranslations("Onboarding.HomePage")
  return (
    <div
      id="OnboardingHomePage"
      className="bg-slate-50 w-full h-full overflow-y-scroll no-scrollbar flex flex-col justify-between items-center px-6 md:px-10 lg:p-16 py-8 md:py-12 gap-6 lg:gap-8"
    >
      <div
        id="OnboardingHomeHeader"
        className="flex flex-col w-full items-center text-center gap-3"
      >
        <RyoGoLogo />
        <H2>{t("Header.Title")}</H2>
        <SmallGrey>{t("Header.Description")}</SmallGrey>
      </div>
      <div id="OnboardingHomeFooter" className="w-full md:w-1/2">
        <Button variant={"default"} size={"lg"} className="w-full">
          <Link href="/onboarding/create-account">
            {t("Footer.PrimaryCTA")}
          </Link>
        </Button>
      </div>
      <div
        id="OnboardingHomeBody"
        className="flex flex-col md:flex-row w-full h-full gap-6 md:gap-8"
      >
        <div
          id="OnboardingHomeSteps"
          className="bg-white shadow rounded-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-2 md:gap-3"
        >
          <PBold>{t("BodySteps.Title")}</PBold>
          <div className="flex flex-col">
            <OnboardingHomeStepItem
              label={t("BodySteps.Step1")}
              icon={AtSign}
            />
            <OnboardingHomeStepItem
              label={t("BodySteps.Step2")}
              icon={FingerprintPattern}
            />
            <OnboardingHomeStepItem label={t("BodySteps.Step3")} icon={Car} />
            <OnboardingHomeStepItem
              label={t("BodySteps.Step4")}
              icon={LifeBuoy}
            />
            <OnboardingHomeStepItem
              label={t("BodySteps.Step5")}
              icon={UserKey}
            />
          </div>
        </div>
        <div
          id="OnboardingHomeChecklist"
          className="bg-white shadow rounded-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-2 md:gap-3"
        >
          <PBold>{t("BodyChecklist.Title")}</PBold>
          <div className="flex flex-col gap-2 md:gap-3">
            <OnboardingHomeDocumentItem
              label={t("BodyChecklist.Item1")}
              icon={Building2}
            />
            <OnboardingHomeDocumentItem
              label={t("BodyChecklist.Item2")}
              icon={Camera}
            />
            <OnboardingHomeDocumentItem
              label={t("BodyChecklist.Item3")}
              icon={FileText}
            />
            <OnboardingHomeDocumentItem
              label={t("BodyChecklist.Item4")}
              icon={IdCard}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
