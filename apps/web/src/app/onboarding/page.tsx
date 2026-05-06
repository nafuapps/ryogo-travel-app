//Onboarding home page

import { H2Brand, PBold, SmallGrey } from "@/components/typography"
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
  LucideIcon,
  UserKey,
} from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import RyoGoLogo from "@/components/logo"

export const metadata: Metadata = {
  title: `Onboarding - ${pageTitle}`,
  description: pageDescription,
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
        <H2Brand>{t("Header.Title")}</H2Brand>
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

function OnboardingHomeDocumentItem(props: {
  icon: LucideIcon
  label: string
}) {
  return (
    <div className="flex flex-row gap-3 md:gap-4 items-center">
      <div className="bg-sky-700 rounded-lg size-10 md:size-12 flex justify-center items-center shrink-0">
        <props.icon className="text-sky-50 size-4 md:size-5" />
      </div>
      <SmallGrey>{props.label}</SmallGrey>
    </div>
  )
}

function OnboardingHomeStepItem(props: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-row gap-3 md:gap-4 items-center">
      <div className="flex flex-col items-center">
        <div className="w-1 h-2 md:h-3 bg-sky-50"></div>
        <div className="bg-sky-50 rounded-full size-10 md:size-12 flex justify-center items-center shrink-0">
          <props.icon className="text-sky-700 size-4 md:size-5" />
        </div>
        <div className="w-1 h-2 md:h-3 bg-sky-50"></div>
      </div>
      <SmallGrey>{props.label}</SmallGrey>
    </div>
  )
}
