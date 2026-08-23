import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesAlertsSection() {
  const t = await getTranslations("Landing.Features.Alerts")
  return (
    <LandingSectionWrapper id="alerts" className="bg-white dark:bg-slate-900">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("A1.Title")}
            description={t("A1.Description")}
            src="/logoPWA.png"
            long
          />
          <FeatureItem
            title={t("A2.Title")}
            description={t("A2.Description")}
            src="/logoPWA.png"
            longReverse
          />
          <FeatureItem
            title={t("A3.Title")}
            description={t("A3.Description")}
            src="/logoPWA.png"
            long
          />
          <FeatureItem
            title={t("A4.Title")}
            description={t("A4.Description")}
            src="/logoPWA.png"
            longReverse
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
