//Onboarding home page

import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { ClickZoomOut } from "@/components/flows/landing/clickZoomOut"
import Footer from "@/components/flows/landing/footer"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Navbar from "@/components/flows/landing/nav"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoH2,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { readPermissions } from "@/lib/permissions"
import { PhoneRegex } from "@/lib/regex"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import {
  AtSign,
  Camera,
  Car,
  ChevronRight,
  FileText,
  FingerprintPattern,
  IdCard,
  Image,
  LucideIcon,
  User,
  UserKey,
} from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Onboarding - ${pageTitle}`,
  description: pageDescription,
}

export default async function OnboardingHomePage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>
}) {
  await readPermissions.redirectIfAuthenticated()

  const { phone } = await searchParams

  const cookieStore = await cookies()
  const isDarkMode = cookieStore.get(DARK_MODE_COOKIE_NAME)?.value === "true"
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  const t = await getTranslations("Onboarding.HomePage")
  return (
    <main
      id="OnboardingHomeMain"
      className="flex flex-col bg-white dark:bg-slate-800 h-full"
    >
      <Navbar isDarkMode={isDarkMode} locale={locale} />
      <LandingSectionWrapper id="hero" hero>
        <LandingContentWrapper
          justifyStart
          className="h-full px-5 sm:px-8 md:px-10 py-20 md:py-24 rounded-lg bg-linear-to-b from-sky-100 dark:from-sky-900 via-cyan-400 dark:via-cyan-700 to-sky-700 dark:to-sky-500"
        >
          <SectionColWrapper className="text-center items-center mt-5 md:mt-6">
            <RyogoCaption color="light" weight="font-medium">
              {t("Header.Subtitle")}
            </RyogoCaption>
            <RyogoH2 color="brand" weight="font-bold">
              {t("Header.Title")}
            </RyogoH2>
          </SectionColWrapper>
          <ClickZoomOut className="w-full max-w-xl">
            <Link
              href={
                PhoneRegex.safeParse(phone).success
                  ? `/onboarding/create-account?phone=${phone}`
                  : "/onboarding/create-account"
              }
            >
              <RyogoBrandButton
                size={"lg"}
                className="w-full"
                label={t("PrimaryCTA")}
              >
                <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
              </RyogoBrandButton>
            </Link>
          </ClickZoomOut>
          <TileGridWrapper>
            <SectionWrapper
              id="OnboardingHomeSteps"
              className="animate-zoom-in max-w-xl mx-auto lg:ml-auto lg:mr-0"
            >
              <RyogoH4 color="light" weight="font-bold">
                {t("BodySteps.Title")}
              </RyogoH4>
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
                <OnboardingHomeStepItem
                  label={t("BodySteps.Step3")}
                  icon={Car}
                />
                <OnboardingHomeStepItem
                  label={t("BodySteps.Step4")}
                  icon={IdCard}
                />
                <OnboardingHomeStepItem
                  label={t("BodySteps.Step5")}
                  icon={UserKey}
                  last
                />
              </div>
              <Separator />
              <RyogoTiny color="light">{t("BodySteps.Warning")}</RyogoTiny>
            </SectionWrapper>
            <SectionWrapper
              id="OnboardingHomeChecklist"
              className="animate-zoom-in max-w-xl mx-auto lg:mr-auto lg:ml-0"
            >
              <RyogoH4 color="light" weight="font-bold">
                {t("BodyChecklist.Title")}
              </RyogoH4>
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
              <OnboardingHomeDocumentItem
                label={t("BodyChecklist.Item5")}
                icon={User}
              />
              <Separator />
              <RyogoTiny color="light">{t("BodyChecklist.Optional")}</RyogoTiny>
              <RyogoTiny color="light">{t("BodyChecklist.Format")}</RyogoTiny>
            </SectionWrapper>
          </TileGridWrapper>
        </LandingContentWrapper>
      </LandingSectionWrapper>
      <Footer />
    </main>
  )
}

function OnboardingHomeDocumentItem({
  icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <SectionRowWrapper className="items-center">
      <RyogoEnclosedIcon icon={icon} color="brand" bgColor="brand" size="sm" />
      <RyogoCaption color="slate">{label}</RyogoCaption>
    </SectionRowWrapper>
  )
}

function OnboardingHomeStepItem({
  icon,
  label,
  first,
  last,
}: {
  icon: LucideIcon
  label: string
  first?: boolean
  last?: boolean
}) {
  return (
    <SectionRowWrapper className="items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-1 h-2 md:h-3 ${!first && `bg-slate-100 dark:bg-slate-700`}`}
        />
        <RyogoEnclosedIcon icon={icon} size="sm" color="light" circular />
        <div
          className={`w-1 h-2 md:h-3 ${!last && `bg-slate-100 dark:bg-slate-700`}`}
        />
      </div>
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </SectionRowWrapper>
  )
}
