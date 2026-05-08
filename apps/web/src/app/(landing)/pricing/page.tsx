import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"
import PricingSection from "@/components/flows/landing/pricing"

export default function PricingPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="pricing" />
      <PricingSection />
      <Footer />
    </div>
  )
}
