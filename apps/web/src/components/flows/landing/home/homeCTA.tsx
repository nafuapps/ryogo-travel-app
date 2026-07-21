import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoCaption,
  RyogoH1,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HomeCTASection() {
  const t = await getTranslations("Landing.Home.CTA")
  return (
    <LandingSectionWrapper
      id="cta"
      shrink
      className="bg-linear-to-b from-sky-600 dark:from-sky-300 to-sky-900 dark:to-sky-50"
    >
      <LandingContentWrapper>
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" className="max-w-4xl text-center opacity-80">
          {t("Subtitle", { days: PREMIUM_TRIAL_DAYS })}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <RyogoSmall color="brand">{t("PrimaryCTA")}</RyogoSmall>
            </Button>
          </Link>
          <Link href={`tel:${SUPPORT_HELPLINE_NUMBER}`}>
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-white dark:border-slate-950 hover:bg-white/20 dark:hover:bg-slate-950/20"
            >
              <RyogoSmall color="white">{t("SecondaryCTA")}</RyogoSmall>
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4 items-center">
          <PropItem label={t("Prop1")} />
          <PropDot />
          <PropItem label={t("Prop2")} />
          <PropDot />
          <PropItem label={t("Prop3")} />
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function PropItem({ label }: { label: string }) {
  return (
    <div className="flex gap-0.5 md:gap-1 items-center">
      <RyogoIcon icon={Check} size="sm" color="white" thick />
      <RyogoCaption color="white">{label}</RyogoCaption>
    </div>
  )
}

function PropDot() {
  return (
    <div className="hidden md:flex bg-sky-200 dark:bg-sky-700 size-1 lg:size-1.5 rounded-full" />
  )
}
