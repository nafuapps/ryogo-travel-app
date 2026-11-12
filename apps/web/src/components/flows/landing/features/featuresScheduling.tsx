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

export default async function FeaturesSchedulingSection() {
  const t = await getTranslations("Landing.Features.Scheduling")
  return (
    <LandingSectionWrapper
      id="scheduling"
      className="bg-slate-100 dark:bg-slate-900"
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
            src="/features/scheduling/booking.png"
            long
          />
          <FeatureItem
            title={t("S2.Title")}
            description={t("S2.Description")}
            src="/features/scheduling/conflict.png"
            longReverse
          />
          <FeatureItem
            title={t("S3.Title")}
            description={t("S3.Description")}
            src="/features/scheduling/creation.png"
            long
          />
          <FeatureItem
            title={t("S4.Title")}
            description={t("S4.Description")}
            src="/features/scheduling/flexibility.png"
            longReverse
          />
          <FeatureItem
            title={t("S5.Title")}
            description={t("S5.Description")}
            src="/features/scheduling/assistant.png"
            long
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
