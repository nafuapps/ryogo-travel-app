import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight, Video } from "lucide-react"
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

export default async function HowItWorksCTASection() {
  const t = await getTranslations("Landing.HowItWorks.CTA")
  return (
    <LandingSectionWrapper id="cta">
      <LandingContentWrapper className="rounded-lg px-5 md:px-10 lg:px-16 py-12 md:py-18 bg-linear-to-b from-sky-600 dark:from-sky-400 to-sky-900 dark:to-sky-100">
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" className="max-w-4xl text-center opacity-80">
          {t("Subtitle", { days: PREMIUM_TRIAL_DAYS })}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/onboarding">
            <RyogoWhiteButton size="lg" label={t("PrimaryCTA")}>
              <RyogoIcon icon={ChevronRight} color="black" size="sm" thick />
            </RyogoWhiteButton>
          </Link>
          {/* //TODO: Demo video */}
          <Link href="/resources#videos">
            <RyogoOutlineButton
              size="lg"
              label={t("SecondaryCTA")}
              labelColor="white"
            >
              <RyogoIcon icon={Video} color="white" size="sm" thick />
            </RyogoOutlineButton>
          </Link>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
