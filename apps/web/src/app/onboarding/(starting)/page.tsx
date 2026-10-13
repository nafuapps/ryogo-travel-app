//Onboarding home page

import {
  RyogoCaption,
  RyogoH1,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import {
  AtSign,
  Camera,
  Car,
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
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import Link from "next/link"
import RyoGoLogo from "@/components/logo"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { PhoneRegex } from "@/lib/regex"
import {
  RyogoBrandButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { Separator } from "@/components/ui/separator"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { ClickZoomOut } from "@/components/flows/landing/clickZoomOut"

export const metadata: Metadata = {
  title: `Onboarding - ${pageTitle}`,
  description: pageDescription,
}

export default async function OnboardingHomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { phone } = await searchParams

  const t = await getTranslations("Onboarding.HomePage")
  return (
    <div
      id="OnboardingHomePage"
      className="bg-slate-50 dark:bg-slate-900 w-full h-full overflow-y-scroll no-scrollbar flex flex-col justify-between items-center px-6 md:px-10 py-8 md:py-12 gap-6 md:gap-8"
    >
      <RyoGoLogo />
      <SectionColWrapper className="items-center text-center my-3 md:my-4">
        <RyogoH1 weight="font-bold">{t("Header.Title")}</RyogoH1>
        <RyogoSmall color="light">{t("Header.Description")}</RyogoSmall>
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
          />
        </Link>
      </ClickZoomOut>
      <TileGridWrapper>
        <SectionWrapper
          id="OnboardingHomeSteps"
          className="animate-zoom-in max-w-xl mx-auto lg:ml-auto lg:mr-0"
        >
          <RyogoH4 color="light" weight="font-bold">
            {" "}
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
            <OnboardingHomeStepItem label={t("BodySteps.Step3")} icon={Car} />
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
            {" "}
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
      <Link href={"/"}>
        <RyogoOutlineButton
          size="lg"
          className="w-full"
          label={t("BackCTA")}
          labelColor="light"
        />
      </Link>
    </div>
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
