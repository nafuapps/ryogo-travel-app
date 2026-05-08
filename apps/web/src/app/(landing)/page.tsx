import HomeHeroSection from "@/components/flows/landing/homeHero"
import FeaturesSection from "@/components/flows/landing/features"
import TestimonialsSection from "@/components/flows/landing/testimonials"
import HomeCTASection from "@/components/flows/landing/homeCTA"
import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"

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
