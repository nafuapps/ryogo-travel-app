import Footer from "@/components/flows/landing/footer"
import HowItWorksAlertsSection from "@/components/flows/landing/howItWorks/howItWorksAlerts"
import HowItWorksBookingsSection from "@/components/flows/landing/howItWorks/howItWorksBookings"
import HowItWorksCTASection from "@/components/flows/landing/howItWorks/howItWorksCTA"
import HowItWorksCustomersSection from "@/components/flows/landing/howItWorks/howItWorksCustomers"
import HowItWorksDriverAppSection from "@/components/flows/landing/howItWorks/howItWorksDriverApp"
import HowItWorksEntitiesSection from "@/components/flows/landing/howItWorks/howItWorksEntities"
import HowItWorksHeroSection from "@/components/flows/landing/howItWorks/howItWorksHero"
import HowItWorksOnboardingSection from "@/components/flows/landing/howItWorks/howItWorksOnboarding"
import Navbar from "@/components/flows/landing/nav"

//hero
//onboarding
//bookings
//entities
//driver app
//customers
//alerts
//cta

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="howItWorks" />
      <HowItWorksHeroSection />
      <HowItWorksOnboardingSection />
      <HowItWorksBookingsSection />
      <HowItWorksEntitiesSection />
      <HowItWorksDriverAppSection />
      <HowItWorksCustomersSection />
      {/* <HowItWorksAlertsSection /> */}
      <HowItWorksCTASection />
      <Footer />
    </div>
  )
}
