import PricingComparisionSection from "@/components/flows/landing/pricing/pricingComparision"
import PricingPlansSection from "@/components/flows/landing/pricing/pricingPlans"
import PricingCTASection from "@/components/flows/landing/pricing/pricingCTA"
import PricingFAQSection from "@/components/flows/landing/pricing/pricingFAQ"
import PricingROISection from "@/components/flows/landing/pricing/pricingROI"
import PricingSocialSection from "@/components/flows/landing/pricing/pricingSocial"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Pricing - ${pageTitle}`,
  description: pageDescription,
}

export default function PricingPage() {
  return (
    <>
      <PricingPlansSection />
      <PricingSocialSection />
      <PricingComparisionSection />
      <PricingROISection />
      <PricingFAQSection />
      <PricingCTASection />
    </>
  )
}
