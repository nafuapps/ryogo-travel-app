import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesCommunicationSection() {
  const t = await getTranslations("Landing.Features.Communication")
  return (
    <LandingSectionWrapper id="communication" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("C1.Title")}
            description={t("C1.Description")}
            src="/logoPWALight.png"
            long
          />
          <FeatureItem
            title={t("C2.Title")}
            description={t("C2.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("C3.Title")}
            description={t("C3.Description")}
            src="/logoPWALight.png"
          />
          <FeatureItem
            title={t("C4.Title")}
            description={t("C4.Description")}
            src="/logoPWALight.png"
            longReverse
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
