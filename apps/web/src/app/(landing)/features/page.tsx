//(Landing) Features page

import FeaturesAnalyticsSection from "@/components/flows/landing/features/featuresAnalytics"
import FeaturesCommunicationSection from "@/components/flows/landing/features/featuresCommunication"
import FeaturesCTASection from "@/components/flows/landing/features/featuresCTA"
import FeaturesHeroSection from "@/components/flows/landing/features/featuresHero"
import FeaturesManagementSection from "@/components/flows/landing/features/featuresmanagement"
import FeaturesMissionsSection from "@/components/flows/landing/features/featuresMissions"
import FeaturesSchedulingSection from "@/components/flows/landing/features/featuresScheduling"
import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"

//hero
//agency management
//scheduling
//commmunication
//analytics
//missions
//cta

export default async function FeaturesPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="features" />
      <FeaturesHeroSection />
      <FeaturesManagementSection />
      <FeaturesSchedulingSection />
      <FeaturesCommunicationSection />
      <FeaturesAnalyticsSection />
      <FeaturesMissionsSection />
      <FeaturesCTASection />
      <Footer />
    </div>
  )
}
