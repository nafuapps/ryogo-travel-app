import HomeHeroSection from "./components/homeHero"
import FeaturesSection from "./components/features"
import TestimonialsSection from "./components/testimonials"
import HomeCTASection from "./components/homeCTA"
import Footer from "./components/footer"
import Navbar from "./components/nav"

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
