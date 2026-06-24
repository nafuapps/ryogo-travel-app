import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { FeatureGrid, FeatureItem } from "./featureWrappers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function FeaturesSchedulingSection() {
  const t = await getTranslations("Landing.Features.Scheduling")
  return (
    <LandingSectionWrapper id="scheduling" className="bg-slate-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        {/* // TODO: Demo video */}
        <Link href="/resources#videos">
          <Button size="lg" className="w-full md:w-auto">
            <RyogoSmall color="white">{t("WatchDemo")}</RyogoSmall>
            <RyogoIcon icon={Video} size="sm" color="white" thick />
          </Button>
        </Link>
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
            longReverse
          />
          <FeatureItem
            title={t("S3.Title")}
            description={t("S3.Description")}
            src="/logoPWALight.png"
            long
          />
          <FeatureItem
            title={t("S4.Title")}
            description={t("S4.Description")}
            src="/logoPWALight.png"
            longReverse
          />
          <FeatureItem
            title={t("S5.Title")}
            description={t("S5.Description")}
            src="/logoPWALight.png"
            long
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
