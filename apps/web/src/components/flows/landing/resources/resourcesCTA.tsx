import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function ResourcesCTASection() {
  const t = await getTranslations("Landing.Resources.CTA")
  return (
    <LandingSectionWrapper
      id="cta"
      shrink
      className="bg-linear-to-b from-slate-500 to-slate-900"
    >
      <LandingContentWrapper>
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" className="max-w-4xl text-center opacity-80">
          {t("Subtitle", { days: TRIAL_DAYS })}
        </RyogoP>
        <div className="flex gap-4 justify-center items-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <RyogoSmall color="slate">{t("PrimaryCTA")}</RyogoSmall>
              <RyogoIcon icon={ChevronRight} color="slate" size="sm" thick />
            </Button>
          </Link>
          <Link href="/features">
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
