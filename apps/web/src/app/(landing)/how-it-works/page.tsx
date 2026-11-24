import HowItWorksBookingsSection from "@/components/flows/landing/howItWorks/howItWorksBookings"
import HowItWorksCTASection from "@/components/flows/landing/howItWorks/howItWorksCTA"
import HowItWorksCustomersSection from "@/components/flows/landing/howItWorks/howItWorksCustomers"
import HowItWorksDriverAppSection from "@/components/flows/landing/howItWorks/howItWorksDriverApp"
import HowItWorksEntitiesSection from "@/components/flows/landing/howItWorks/howItWorksEntities"
import HowItWorksFAQSection from "@/components/flows/landing/howItWorks/howItWorksFAQ"
import HowItWorksHeroSection from "@/components/flows/landing/howItWorks/howItWorksHero"
import HowItWorksMissionsSection from "@/components/flows/landing/howItWorks/howItWorksMissions"
import HowItWorksOnboardingSection from "@/components/flows/landing/howItWorks/howItWorksOnboarding"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `How It Works - ${pageTitle}`,
  description: pageDescription,
}

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHeroSection />
      <HowItWorksOnboardingSection />
      <HowItWorksBookingsSection />
      <HowItWorksEntitiesSection />
      <HowItWorksDriverAppSection />
      <HowItWorksCustomersSection />
      <HowItWorksMissionsSection />
      <HowItWorksFAQSection />
      <HowItWorksCTASection />
    </>
  )
}
