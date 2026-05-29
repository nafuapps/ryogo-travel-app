import MissionCard from "@/components/missions/missionCard"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { getTranslations } from "next-intl/server"

export default async function MissionControlPageComponent({
  missions,
}: {
  missions: FindMissionsByUserIdType
}) {
  const t = await getTranslations("Dashboard.MissionControl")
  const criticalMissions = missions.filter((mission) => mission.isCritical)
  const nonCriticalMissions = missions.filter((mission) => !mission.isCritical)
  return (
    <PageWrapper id="MissionControlPage">
      {missions.length === 0 && (
        <RyogoSmall color="slate">{t("NoMissions")}</RyogoSmall>
      )}
      {missions.length > 0 && (
        <>
          {criticalMissions.length > 0 && (
            <>
              <RyogoSmall color="light">{t("CriticalMissions")}</RyogoSmall>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {criticalMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </>
          )}
          {nonCriticalMissions.length > 0 && (
            <>
              <RyogoSmall color="light">{t("OtherMissions")}</RyogoSmall>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {nonCriticalMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PageWrapper>
  )
}
