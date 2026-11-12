import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { RyogoDialogVideo } from "@/components/video/ryogoVideo"
import { Video } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { FeatureGrid, FeatureItem } from "./featureWrappers"

export default async function FeaturesManagementSection() {
  const t = await getTranslations("Landing.Features.Management")
  return (
    <LandingSectionWrapper
      id="management"
      className="bg-white dark:bg-slate-800"
    >
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        {/* // TODO: Management Demo video source */}
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
            title={t("M1.Title")}
            description={t("M1.Description")}
            src="/features/management/control.png"
          />
          <FeatureItem
            title={t("M2.Title")}
            description={t("M2.Description")}
            src="/features/management/delegate.png"
          />
          <FeatureItem
            title={t("M3.Title")}
            description={t("M3.Description")}
            src="/features/management/loop.png"
          />
          <FeatureItem
            title={t("M4.Title")}
            description={t("M4.Description")}
            src="/features/management/automated.png"
          />
          <FeatureItem
            title={t("M5.Title")}
            description={t("M5.Description")}
            src="/features/management/customer.png"
          />
          <FeatureItem
            title={t("M6.Title")}
            description={t("M6.Description")}
            src="/features/management/whiteboard.png"
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
