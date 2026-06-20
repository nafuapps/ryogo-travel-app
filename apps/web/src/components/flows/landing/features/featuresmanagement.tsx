import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function FeaturesManagementSection() {
  const t = await getTranslations("Landing.Features.Management")
  return (
    <LandingSectionWrapper id="management" className="bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
