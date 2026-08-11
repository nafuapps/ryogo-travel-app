import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight, Video } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksCTASection() {
  const t = await getTranslations("Landing.HowItWorks.CTA")
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
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <RyogoSmall color="brand">{t("PrimaryCTA")}</RyogoSmall>
              <RyogoIcon icon={ChevronRight} color="brand" size="sm" thick />
            </Button>
          </Link>
          {/* //TODO: Demo video */}
          <Link href="/resources#videos">
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-white dark:border-slate-950 hover:bg-white/20 dark:hover:bg-slate-950/20"
            >
              <RyogoSmall color="white">{t("SecondaryCTA")}</RyogoSmall>
              <RyogoIcon icon={Video} color="white" size="sm" thick />
            </Button>
          </Link>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
