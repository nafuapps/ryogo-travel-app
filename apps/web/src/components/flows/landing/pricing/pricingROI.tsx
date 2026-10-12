import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { ClickZoomOut } from "@/components/flows/landing/clickZoomOut"
import ROICard from "@/components/flows/landing/pricing/roiCard"

export default async function PricingROISection() {
  const t = await getTranslations("Landing.Pricing.ROI")
  return (
    <LandingSectionWrapper id="roi" className="bg-slate-50 dark:bg-slate-900">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <ROICard />
        <ClickZoomOut>
          <Link href="/onboarding">
            <RyogoDefaultButton
              size="lg"
              label={t("PrimaryCTA")}
              className="w-full md:w-auto"
            >
              <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
            </RyogoDefaultButton>
          </Link>
        </ClickZoomOut>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
