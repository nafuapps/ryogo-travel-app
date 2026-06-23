import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesAnalyticsSection() {
  const t = await getTranslations("Landing.Features.Analytics")
  return (
    <LandingSectionWrapper id="analytics" className="bg-slate-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("A1.Title")}
            description={t("A1.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("A2.Title")}
            description={t("A2.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("A3.Title")}
            description={t("A3.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("A4.Title")}
            description={t("A4.Description")}
            src="/logoPWALight.png"
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
