import HomeHeroSection from "@/components/flows/landing/home/homeHero"
import HomeFeaturesSection from "@/components/flows/landing/home/homeFeatures"
import HomeWorkingSection from "@/components/flows/landing/home/homeWorking"
import HomeTestimonialsSection from "@/components/flows/landing/home/homeTestimonials"
import HomeCTASection from "@/components/flows/landing/home/homeCTA"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Home - ${pageTitle}`,
  description: pageDescription,
}

export default async function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeWorkingSection />
      <HomeTestimonialsSection />
      <HomeCTASection />
    </>
  )
}
