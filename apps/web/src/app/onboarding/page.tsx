//Onboarding home page

import { RyogoH2, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  AtSign,
  Camera,
  Car,
  FileText,
  FingerprintPattern,
  IdCard,
  Image,
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
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { PhoneRegex } from "@/lib/regex"

export const metadata: Metadata = {
  title: `Onboarding - ${pageTitle}`,
  description: pageDescription,
}

export default async function OnboardingHomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getCurrentUser()

  // Redirect to private route if the user is authenticated
  if (user) {
    if (user.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  const { phone } = await searchParams

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
        <RyogoH2>{t("Header.Title")}</RyogoH2>
        <RyogoSmall color="slate">{t("Header.Description")}</RyogoSmall>
      </div>
      <div id="OnboardingHomeFooter" className="w-full md:w-1/2">
        <Button variant={"default"} size={"lg"} className="w-full">
          <Link
            href={
              PhoneRegex.safeParse(phone).success
                ? `/onboarding/create-account?phone=${phone}`
                : "/onboarding/create-account"
            }
          >
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
          <RyogoP weight="font-bold"> {t("BodySteps.Title")}</RyogoP>
          <div className="flex flex-col">
            <OnboardingHomeStepItem
              label={t("BodySteps.Step1")}
              icon={AtSign}
              first
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
              last
            />
          </div>
        </div>
        <div
          id="OnboardingHomeChecklist"
          className="bg-white shadow rounded-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-2 md:gap-3"
        >
          <RyogoP weight="font-bold"> {t("BodyChecklist.Title")}</RyogoP>
          <div className="flex flex-col gap-2 md:gap-3">
            <OnboardingHomeDocumentItem
              label={t("BodyChecklist.Item1")}
              icon={Image}
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
      <RyogoEnclosedIcon
        icon={props.icon}
        color="brand"
        bgColor="brand"
        size="sm"
      />

      <RyogoSmall color="slate">{props.label}</RyogoSmall>
    </div>
  )
}

function OnboardingHomeStepItem(props: {
  icon: LucideIcon
  label: string
  first?: boolean
  last?: boolean
}) {
  return (
    <div className="flex flex-row gap-3 md:gap-4 items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-1 h-2 md:h-3 ${!props.first && `bg-slate-100`}`}
        ></div>
        <RyogoEnclosedIcon icon={props.icon} size="sm" color="brand" circular />
        <div
          className={`w-1 h-2 md:h-3 ${!props.last && `bg-slate-100`}`}
        ></div>
      </div>
      <RyogoSmall color="slate">{props.label}</RyogoSmall>
    </div>
  )
}
