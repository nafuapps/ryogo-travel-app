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
import { RyogoDialogVideo } from "@/components/video/ryogoVideo"
import {
  RyogoOutlineButton,
  RyogoWhiteButton,
} from "@/components/buttons/ryogoButtons"

export default async function PricingCTASection() {
  const t = await getTranslations("Landing.Pricing.CTA")
  return (
    <LandingSectionWrapper
      id="cta"
      shrink
      className="bg-linear-to-b from-sky-600 dark:from-sky-300 to-sky-900 dark:to-sky-50"
    >
      <LandingContentWrapper className="md:flex-row">
        <RyogoH1 color="white" weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <div className="flex flex-col gap-4 justify-center items-center">
          <RyogoP color="white" className="max-w-4xl text-center opacity-80">
            {t("Subtitle", { days: PREMIUM_TRIAL_DAYS })}
          </RyogoP>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <RyogoWhiteButton
                size="lg"
                label={t("PrimaryCTA")}
                labelColor="brand"
                className="w-full md:w-auto "
              >
                <RyogoIcon icon={ChevronRight} color="brand" size="sm" thick />
              </RyogoWhiteButton>
            </Link>
            {/* //TODO: Demo video source*/}
            <RyogoDialogVideo
              src="https://www.youtube.com/embed/1MobY_vR7-g"
              title="RyoGo Demo video"
              className="w-full aspect-video"
            >
              <RyogoOutlineButton
                size="lg"
                label={t("SecondaryCTA")}
                labelColor="white"
                className="w-full md:w-auto"
              >
                <RyogoIcon icon={Video} color="white" size="sm" thick />
              </RyogoOutlineButton>
            </RyogoDialogVideo>
          </div>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
