import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesSchedulingSection() {
  const t = await getTranslations("Landing.Features.Scheduling")
  return (
    <LandingSectionWrapper id="scheduling" className="bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
