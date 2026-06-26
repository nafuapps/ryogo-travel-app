import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"
import ResourcesAboutSection from "@/components/flows/landing/resources/resourcesAbout"
import ResourcesBlogsSection from "@/components/flows/landing/resources/resourcesBlogs"
import ResourcesCTASection from "@/components/flows/landing/resources/resourcesCTA"
import ResourcesFAQSection from "@/components/flows/landing/resources/resourcesFAQ"
import ResourcesHeroSection from "@/components/flows/landing/resources/resourcesHero"
import ResourcesSupportSection from "@/components/flows/landing/resources/resourcesSupport"
import ResourcesVideosSection from "@/components/flows/landing/resources/resourcesVideos"

//Hero (with main demo)
//Videos
//FAQs
//Support
//Blog
//About us

export default function ResourcesPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="resources" />
      <ResourcesHeroSection />
      <ResourcesVideosSection />
      <ResourcesSupportSection />
      <ResourcesBlogsSection />
      <ResourcesAboutSection />
      <ResourcesFAQSection />
      <ResourcesCTASection />
      <Footer />
    </div>
  )
}
