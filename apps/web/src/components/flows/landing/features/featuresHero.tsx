import { RyogoH1, RyogoP } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesHeroSection() {
  const t = await getTranslations("Landing.Features.Hero")
  return (
    <LandingSectionWrapper id="hero" hero className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
