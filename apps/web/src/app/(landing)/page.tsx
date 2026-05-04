import HomeHeroSection from "@/components/landing/homeHero"
import FeaturesSection from "@/components/landing/features"
import TestimonialsSection from "@/components/landing/testimonials"
import HomeCTASection from "@/components/landing/homeCTA"
import Footer from "@/components/landing/footer"
import Navbar from "@/components/landing/nav"

export default async function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="home" />
      <HomeHeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <HomeCTASection />
      <Footer />
    </div>
  )
}
