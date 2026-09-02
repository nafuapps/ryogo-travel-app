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

export default async function ResourcesCTASection() {
  const t = await getTranslations("Landing.Resources.CTA")
  return (
    <LandingSectionWrapper
      id="cta"
      shrink
      className="bg-linear-to-b from-slate-600 dark:from-slate-300 to-slate-900 dark:to-slate-50"
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
            <RyogoWhiteButton size="lg" label={t("PrimaryCTA")}>
              <RyogoIcon icon={ChevronRight} color="black" size="sm" thick />
            </RyogoWhiteButton>
          </Link>
          <Link href="/features">
            <RyogoOutlineButton
              size="lg"
              labelColor="white"
              label={t("SecondaryCTA")}
            />
          </Link>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
