import MissionCard from "@/components/missions/missionCard"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { getTranslations } from "next-intl/server"

export default async function MissionControlPageComponent({
  missions,
}: {
  missions: FindMissionsByUserIdType
}) {
  const t = await getTranslations("Dashboard.MissionControl")
  return (
    <PageWrapper id="MissionControlPage">
      <SectionColWrapper>
        {missions.length === 0 ? (
          <p>{t("NoMissions")}</p>
        ) : (
          missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}
