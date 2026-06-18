import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"
import PricingComparisionSection from "@/components/flows/landing/pricing/pricingComparision"
import PricingPlansSection from "@/components/flows/landing/pricing/pricingPlans"
import PricingCTASection from "@/components/flows/landing/pricing/pricingCTA"
import PricingFAQSection from "@/components/flows/landing/pricing/pricingFAQ"

export default function PricingPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="pricing" />
      <PricingPlansSection />
      <PricingComparisionSection />
      <PricingFAQSection />
      <PricingCTASection />
      <Footer />
    </div>
  )
}
