import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesManagementSection() {
  const t = await getTranslations("Landing.Features.Management")
  return (
    <LandingSectionWrapper id="management" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("M1.Title")}
            description={t("M1.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("M2.Title")}
            description={t("M2.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("M3.Title")}
            description={t("M3.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("M4.Title")}
            description={t("M4.Description")}
            src="/logoPWALight.png"
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
