import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksAlertsSection() {
  const t = await getTranslations("Landing.HowItWorks.Alerts")
  return (
    <LandingSectionWrapper id="alerts" className=" bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
