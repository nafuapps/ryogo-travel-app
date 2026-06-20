import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight, Video } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesCTASection() {
  const t = await getTranslations("Landing.Features.CTA")
  return (
    <LandingSectionWrapper id="cta">
      <LandingContentWrapper className="h-full rounded-lg px-5 md:px-10 lg:px-16 py-24 md:py-32 bg-linear-to-b from-sky-600 to-sky-900">
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" className="max-w-4xl text-center opacity-80">
          {t("Subtitle", { days: TRIAL_DAYS })}
        </RyogoP>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <RyogoSmall color="brand">{t("PrimaryCTA")}</RyogoSmall>
              <RyogoIcon icon={ChevronRight} color="brand" size="sm" thick />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-white hover:bg-white/20"
            >
              <RyogoSmall color="white">{t("SecondaryCTA")}</RyogoSmall>
            </Button>
          </Link>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
