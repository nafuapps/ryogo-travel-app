import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  FeatureGrid,
  FeatureItem,
} from "@/components/flows/landing/features/featureWrappers"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function HomeFeaturesSection() {
  const t = await getTranslations("Landing.Home.Features")
  return (
    <LandingSectionWrapper id="features">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeatureItem
            title={t("F1.Title")}
            description={t("F1.Description")}
            src="/home/features/booking_management.png"
          />
          <FeatureItem
            title={t("F2.Title")}
            description={t("F2.Description")}
            src="/home/features/driver_communication.png"
          />
          <FeatureItem
            title={t("F3.Title")}
            description={t("F3.Description")}
            src="/home/features/fleet_scheduling.png"
          />
          <FeatureItem
            title={t("F4.Title")}
            description={t("F4.Description")}
            src="/home/features/mission_control.png"
          />
        </FeatureGrid>
        <Link href="/features" prefetch={false}>
          <RyogoDefaultButton
            size="lg"
            label={t("MoreCTA")}
            className="w-full md:w-auto"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
