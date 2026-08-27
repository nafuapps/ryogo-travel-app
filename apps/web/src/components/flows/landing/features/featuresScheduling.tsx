import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"
import { Video } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogVideo } from "@/components/video/ryogoVideo"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default async function FeaturesSchedulingSection() {
  const t = await getTranslations("Landing.Features.Scheduling")
  return (
    <LandingSectionWrapper
      id="scheduling"
      className="bg-slate-100 dark:bg-slate-950"
    >
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        {/* // TODO: Demo video */}
        <RyogoDialogVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          title="RyoGo Demo video"
          className="w-full aspect-video"
        >
          <RyogoDefaultButton
            size="lg"
            label={t("WatchDemo")}
            className="w-full md:w-auto"
          >
            <RyogoIcon icon={Video} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </RyogoDialogVideo>
        <FeatureGrid>
          <FeatureItem
            title={t("S1.Title")}
            description={t("S1.Description")}
            src="/logoPWA.png"
            long
          />
          <FeatureItem
            title={t("S2.Title")}
            description={t("S2.Description")}
            src="/logoPWA.png"
            longReverse
          />
          <FeatureItem
            title={t("S3.Title")}
            description={t("S3.Description")}
            src="/logoPWA.png"
            long
          />
          <FeatureItem
            title={t("S4.Title")}
            description={t("S4.Description")}
            src="/logoPWA.png"
            longReverse
          />
          <FeatureItem
            title={t("S5.Title")}
            description={t("S5.Description")}
            src="/logoPWA.png"
            long
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
