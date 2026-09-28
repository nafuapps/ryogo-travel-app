import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import MissionCard from "@/components/missions/missionCard"
import {
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { differenceInDays } from "date-fns"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { EXPIRATION_ALERT_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export default async function MyMissionsPageComponent({
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
    <PageWrapper id="MyMissionsPage">
      {criticalMissions.length > 0 && (
        <RyogoCarouselWrapper
          count={t("CriticalMissions", { count: criticalMissions.length })}
        >
          {criticalMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} isRider />
          ))}
        </RyogoCarouselWrapper>
      )}

      {otherMissions.length > 0 && (
        <RyogoCarouselWrapper
          count={t("OtherMissions", { count: otherMissions.length })}
        >
          {otherMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} isRider />
          ))}
        </RyogoCarouselWrapper>
      )}
      <StickyActionWrapper>
        {isPremium && (
          <Link href={`/rider/myMissions/add`} className="w-full">
            <RyogoDefaultButton
              size="lg"
              label={t("AddCustomMission")}
              className="w-full"
            />
          </Link>
        )}
        <HelpIconButton
          href={"/rider/mySupport/help-missions"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
