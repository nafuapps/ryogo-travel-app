import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksCustomersSection() {
  const t = await getTranslations("Landing.HowItWorks.Customers")
  return (
    <LandingSectionWrapper id="customers" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
