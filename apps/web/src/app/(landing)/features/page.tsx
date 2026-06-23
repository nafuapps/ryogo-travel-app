//(Landing) Features page

import FeaturesAnalyticsSection from "@/components/flows/landing/features/featuresAnalytics"
import FeaturesCommunicationSection from "@/components/flows/landing/features/featuresCommunication"
import FeaturesCTASection from "@/components/flows/landing/features/featuresCTA"
import FeaturesHeroSection from "@/components/flows/landing/features/featuresHero"
import FeaturesManagementSection from "@/components/flows/landing/features/featuresManagement"
import FeaturesMenuSection from "@/components/flows/landing/features/featuresMenu"
import FeaturesAlertsSection from "@/components/flows/landing/features/featuresAlerts"
import FeaturesSchedulingSection from "@/components/flows/landing/features/featuresScheduling"
import FeaturesSecuritySection from "@/components/flows/landing/features/featuresSecurity"
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
      <FeaturesMenuSection />
      <FeaturesManagementSection />
      <FeaturesSchedulingSection />
      <FeaturesCommunicationSection />
      <FeaturesAnalyticsSection />
      <FeaturesAlertsSection />
      <FeaturesSecuritySection />
      <FeaturesCTASection />
      <Footer />
    </div>
  )
}
