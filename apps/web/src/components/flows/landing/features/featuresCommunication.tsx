import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesCommunicationSection() {
  const t = await getTranslations("Landing.Features.Communication")
  return (
    <LandingSectionWrapper id="communication" className="bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
