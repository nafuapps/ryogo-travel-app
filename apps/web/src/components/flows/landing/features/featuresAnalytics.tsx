import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesAnalyticsSection() {
  const t = await getTranslations("Landing.Features.Analytics")
  return (
    <LandingSectionWrapper id="analytics" className="bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
