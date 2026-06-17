import HomeHeroSection from "@/components/flows/landing/home/homeHero"
import HomeFeaturesSection from "@/components/flows/landing/home/homeFeatures"
import HomeWorkingSection from "@/components/flows/landing/home/homeWorking"
import HomeTestimonialsSection from "@/components/flows/landing/home/homeTestimonials"
import HomeCTASection from "@/components/flows/landing/home/homeCTA"
import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"

export default async function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="home" />
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeWorkingSection />
      <HomeTestimonialsSection />
      <HomeCTASection />
      <Footer />
    </div>
  )
}
