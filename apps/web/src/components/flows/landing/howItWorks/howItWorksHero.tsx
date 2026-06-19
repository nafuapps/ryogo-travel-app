import { RyogoH1, RyogoP } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksHeroSection() {
  const t = await getTranslations("Landing.HowItWorks.Hero")
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper className="relative h-full px-5 md:px-10 lg:px-16 py-24 md:py-32 rounded-lg bg-linear-to-b from-sky-400 to-sky-50">
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
