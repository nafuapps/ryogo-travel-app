import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksEntitiesSection() {
  const t = await getTranslations("Landing.HowItWorks.Entities")
  return (
    <LandingSectionWrapper id="entities" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
