//Onboarding home page

import {
  RyogoCaption,
  RyogoH1,
  RyogoP,
  RyogoSmall,
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
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { Separator } from "@/components/ui/separator"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"

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
      <div id="OnboardingHomeCTA" className="w-full md:w-1/2">
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
            label={t("Footer.PrimaryCTA")}
          />
        </Link>
      </div>
      <TileGridWrapper>
        <SectionWrapper id="OnboardingHomeSteps">
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
              icon={IdCard}
            />
            <OnboardingHomeStepItem
              label={t("BodySteps.Step5")}
              icon={UserKey}
              last
            />
          </div>
        </SectionWrapper>
        <SectionWrapper id="OnboardingHomeChecklist">
          <RyogoP weight="font-bold"> {t("BodyChecklist.Title")}</RyogoP>
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
          <RyogoCaption color="light">
            {t("BodyChecklist.Optional")}
          </RyogoCaption>
          <RyogoCaption color="light">{t("BodyChecklist.Format")}</RyogoCaption>
        </SectionWrapper>
      </TileGridWrapper>
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
      <RyogoSmall color="slate">{label}</RyogoSmall>
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
          className={`w-1 h-2 md:h-3 ${!first && `bg-slate-50 dark:bg-slate-900`}`}
        ></div>
        <RyogoEnclosedIcon icon={icon} size="md" color="light" circular />
        <div
          className={`w-1 h-2 md:h-3 ${!last && `bg-slate-50 dark:bg-slate-900`}`}
        ></div>
      </div>
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </SectionRowWrapper>
  )
}
