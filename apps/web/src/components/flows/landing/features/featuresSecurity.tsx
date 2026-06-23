import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesSecuritySection() {
  const t = await getTranslations("Landing.Features.Security")
  return (
    <LandingSectionWrapper id="security" className="bg-slate-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("S1.Title")}
            description={t("S1.Description")}
            src="/logoPWALight.png"
            long
          />
          <FeatureItem
            title={t("S2.Title")}
            description={t("S2.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("S3.Title")}
            description={t("S3.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("S4.Title")}
            description={t("S4.Description")}
            src="/logoPWALight.png"
            longReverse
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
