import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesMissionsSection() {
  const t = await getTranslations("Landing.Features.Missions")
  return (
    <LandingSectionWrapper id="missions" className="bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
