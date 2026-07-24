import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import MissionCard from "@/components/missions/missionCard"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { CalendarPlus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function MyMissionControlPageComponent({
  missions,
  isPremium,
  driverAlert,
}: {
  missions: FindMissionsByUserIdType
  isPremium: boolean
  driverAlert?: FindDriverByUserIdType
}) {
  const t = await getTranslations("Dashboard.MissionControl")
  const criticalMissions = missions.filter((mission) => mission.isCritical)
  const otherMissions = missions.filter((mission) => !mission.isCritical)

  return (
    <PageWrapper id="MyMissionControlPage">
      {isPremium && (
        <Link href={`/dashboard/mission-control/add`} className="self-center">
          <Button variant={"outline"} className="w-full">
            <RyogoIcon icon={CalendarPlus} color="slate" size="sm" />
            <RyogoCaption color="slate">{t("AddCustomMission")}</RyogoCaption>
          </Button>
        </Link>
      )}
      {criticalMissions.length > 0 && (
        <RyogoCarouselWrapper
          count={t("CriticalMissions", { count: criticalMissions.length })}
        >
          {criticalMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </RyogoCarouselWrapper>
      )}
      {driverAlert && driverAlert.licenseExpiresOn && (
        <RyogoCarouselWrapper count={t("ExpiryAlerts.Header", { count: 1 })}>
          <ExpiryAlertCard
            key={driverAlert.id}
            dueDate={driverAlert.licenseExpiresOn}
            entityId={driverAlert.id}
            entityName={driverAlert.name}
            expiryType="License"
            isDriver
          />
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
    </PageWrapper>
  )
}
