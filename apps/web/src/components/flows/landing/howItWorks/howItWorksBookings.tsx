import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HowItWorksBookingsSection() {
  const t = await getTranslations("Landing.HowItWorks.Bookings")
  return (
    <LandingSectionWrapper id="bookings" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <></>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
