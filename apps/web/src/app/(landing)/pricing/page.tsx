import Footer from "../components/footer"
import Navbar from "../components/nav"
import PricingSection from "../components/pricing"

export default function PricingPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="pricing" />
      <PricingSection />
      <Footer />
    </div>
  )
}
