import HowItWorksMissionsSection from "@/components/flows/landing/howItWorks/howItWorksMissions"
import HowItWorksBookingsSection from "@/components/flows/landing/howItWorks/howItWorksBookings"
import HowItWorksCTASection from "@/components/flows/landing/howItWorks/howItWorksCTA"
import HowItWorksCustomersSection from "@/components/flows/landing/howItWorks/howItWorksCustomers"
import HowItWorksDriverAppSection from "@/components/flows/landing/howItWorks/howItWorksDriverApp"
import HowItWorksEntitiesSection from "@/components/flows/landing/howItWorks/howItWorksEntities"
import HowItWorksHeroSection from "@/components/flows/landing/howItWorks/howItWorksHero"
import HowItWorksOnboardingSection from "@/components/flows/landing/howItWorks/howItWorksOnboarding"
import HowItWorksFAQSection from "@/components/flows/landing/howItWorks/howItWorksFAQ"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

//hero
//onboarding
//bookings
//entities
//driver app
//customers
//missions
//faq
//cta

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
