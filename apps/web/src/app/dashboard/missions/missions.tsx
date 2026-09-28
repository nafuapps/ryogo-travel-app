import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MissionCard from "@/components/missions/missionCard"
import {
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function MissionsPageComponent({
  missions,
  isPremium,
}: {
  missions: FindMissionsByUserIdType
  isPremium: boolean
}) {
  const t = await getTranslations("Dashboard.Missions")
  const criticalMissions = missions.filter((mission) => mission.isCritical)
  const otherMissions = missions.filter((mission) => !mission.isCritical)

  return (
    <PageWrapper id="MissionsPage">
      {criticalMissions.length > 0 && (
        <RyogoCarouselWrapper
          count={t("CriticalMissions", { count: criticalMissions.length })}
        >
          {criticalMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </RyogoCarouselWrapper>
      )}
      {otherMissions.length > 0 && (
        <RyogoCarouselWrapper
          count={t("OtherMissions", { count: otherMissions.length })}
        >
          {otherMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </RyogoCarouselWrapper>
      )}
      <StickyActionWrapper>
        {isPremium && (
          <Link href={`/dashboard/missions/add`} className="w-full">
            <RyogoDefaultButton
              size="lg"
              label={t("AddCustomMission")}
              className="w-full"
            />
          </Link>
        )}
        <HelpIconButton
          href={"/dashboard/support/help-missions"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
