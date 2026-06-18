import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksDriverAppSection() {
  const t = await getTranslations("Landing.HowItWorks.DriverApp")
  return (
    <LandingSectionWrapper id="driverApp" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
