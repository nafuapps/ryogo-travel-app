import ResourcesAboutSection from "@/components/flows/landing/resources/resourcesAbout"
import ResourcesBlogsSection from "@/components/flows/landing/resources/resourcesBlogs"
import ResourcesCTASection from "@/components/flows/landing/resources/resourcesCTA"
import ResourcesFAQSection from "@/components/flows/landing/resources/resourcesFAQ"
import ResourcesHeroSection from "@/components/flows/landing/resources/resourcesHero"
import ResourcesSupportSection from "@/components/flows/landing/resources/resourcesSupport"
import ResourcesVideosSection from "@/components/flows/landing/resources/resourcesVideos"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"

//Hero (with main demo)
//Videos
//FAQs
//Support
//Blog
//About us

export const metadata: Metadata = {
  title: `Resources - ${pageTitle}`,
  description: pageDescription,
}

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHeroSection />
      <ResourcesVideosSection />
      <ResourcesSupportSection />
      <ResourcesBlogsSection />
      <ResourcesAboutSection />
      <ResourcesFAQSection />
      <ResourcesCTASection />
    </>
  )
}
