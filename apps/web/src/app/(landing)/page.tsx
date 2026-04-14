import HeroSection from "./components/hero"
import FeaturesSection from "./components/features"
import TestimonialsSection from "./components/testimonials"
import PricingSection from "./components/pricing"
import CTASection from "./components/cta"
import Footer from "./components/footer"
import Navbar from "./components/nav"

export default async function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="home" />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
