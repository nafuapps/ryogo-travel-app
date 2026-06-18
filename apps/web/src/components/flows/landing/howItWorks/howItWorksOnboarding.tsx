import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksOnboardingSection() {
  const t = await getTranslations("Landing.HowItWorks.Onboarding")
  return (
    <LandingSectionWrapper id="onboarding" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
