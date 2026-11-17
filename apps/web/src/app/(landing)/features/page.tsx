// import FeaturesAnalyticsSection from "@/components/flows/landing/features/featuresAnalytics"
import FeaturesAlertsSection from "@/components/flows/landing/features/featuresAlerts"
import FeaturesCommunicationSection from "@/components/flows/landing/features/featuresCommunication"
import FeaturesCTASection from "@/components/flows/landing/features/featuresCTA"
import FeaturesFAQSection from "@/components/flows/landing/features/featuresFAQ"
import FeaturesHeroSection from "@/components/flows/landing/features/featuresHero"
import FeaturesManagementSection from "@/components/flows/landing/features/featuresManagement"
import FeaturesMenuSection from "@/components/flows/landing/features/featuresMenu"
import FeaturesSchedulingSection from "@/components/flows/landing/features/featuresScheduling"
import FeaturesSecuritySection from "@/components/flows/landing/features/featuresSecurity"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Features - ${pageTitle}`,
  description: pageDescription,
}

//TODO: Analytics section
export default async function FeaturesPage() {
  return (
    <>
      <FeaturesHeroSection />
      <FeaturesMenuSection />
      <FeaturesManagementSection />
      <FeaturesSchedulingSection />
      <FeaturesCommunicationSection />
      {/* <FeaturesAnalyticsSection /> */}
      <FeaturesAlertsSection />
      <FeaturesSecuritySection />
      <FeaturesFAQSection />
      <FeaturesCTASection />
    </>
  )
}
