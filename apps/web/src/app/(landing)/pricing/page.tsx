import Footer from "@/components/landing/footer"
import Navbar from "@/components/landing/nav"
import PricingSection from "@/components/landing/pricing"

export default function PricingPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="pricing" />
      <PricingSection />
      <Footer />
    </div>
  )
}
