import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  RyogoOutlineButton,
  RyogoWhiteButton,
} from "@/components/buttons/ryogoButtons"
import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { ClickZoomOut } from "@/components/flows/landing/clickZoomOut"

export default async function FeaturesCTASection() {
  const t = await getTranslations("Landing.Features.CTA")
  return (
    <LandingSectionWrapper id="cta">
      <LandingContentWrapper className="rounded-lg px-5 md:px-10 lg:px-16 py-12 md:py-18 bg-linear-to-b from-slate-400 dark:from-slate-400 to-slate-900 dark:to-slate-50">
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <SectionColWrapper small>
          <RyogoP color="white" className="max-w-4xl text-center opacity-80">
            {t("Subtitle1")}
          </RyogoP>
          <RyogoP color="white" className="max-w-4xl text-center opacity-80">
            {t("Subtitle2", { days: PREMIUM_TRIAL_DAYS })}
          </RyogoP>
        </SectionColWrapper>
        <ScrollZoomIn className="flex flex-col lg:flex-row gap-4 lg:gap-5 justify-center items-center">
          <ClickZoomOut>
            <Link href="/onboarding">
              <RyogoWhiteButton
                size="lg"
                label={t("PrimaryCTA")}
                className="w-full md:w-auto"
              >
                <RyogoIcon icon={ChevronRight} color="slate" size="sm" thick />
              </RyogoWhiteButton>
            </Link>
          </ClickZoomOut>
          <ClickZoomOut>
            <Link href="/how-it-works">
              <RyogoOutlineButton
                size="lg"
                label={t("SecondaryCTA")}
                labelColor="white"
                className="w-full md:w-auto"
              />
            </Link>
          </ClickZoomOut>
        </ScrollZoomIn>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
