import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import MissionCard from "@/components/missions/missionCard"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindAgencyExpiryAlertsType } from "@ryogo-travel-app/api/services/agency.services"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { CalendarPlus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function MissionControlPageComponent({
  missions,
  isPremium,
  expiryAlerts,
}: {
  missions: FindMissionsByUserIdType
  isPremium: boolean
  expiryAlerts?: FindAgencyExpiryAlertsType
  driverAlert?: FindDriverByUserIdType
}) {
  const t = await getTranslations("Dashboard.MissionControl")
  const criticalMissions = missions.filter((mission) => mission.isCritical)
  const otherMissions = missions.filter((mission) => !mission.isCritical)

  const expiryAlertsCount = expiryAlerts
    ? expiryAlerts.driverLeaveAlerts.length +
      expiryAlerts.vehicleRepairAlerts.length +
      expiryAlerts.pucExpiring.length +
      expiryAlerts.rcExpiring.length +
      expiryAlerts.insuranceExpiring.length
    : 0

  return (
    <PageWrapper id="MissionControlPage">
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
      {expiryAlerts && (
        <RyogoCarouselWrapper
          count={t("ExpiryAlerts.Header", { count: expiryAlertsCount })}
        >
          {expiryAlerts.vehicleRepairAlerts.map((repair) => (
            <ExpiryAlertCard
              key={repair.id}
              dueDate={repair.endDate}
              entityId={repair.vehicleId}
              entityName={repair.vehicle.vehicleNumber}
              expiryType="Repair"
            />
          ))}
          {expiryAlerts.driverLeaveAlerts.map((leave) => (
            <ExpiryAlertCard
              key={leave.id}
              dueDate={leave.endDate}
              entityId={leave.driverId}
              entityName={leave.driver.name}
              expiryType="Leave"
            />
          ))}
          {expiryAlerts.rcExpiring.map(
            (rc) =>
              rc.rcExpiresOn && (
                <ExpiryAlertCard
                  key={rc.id}
                  dueDate={rc.rcExpiresOn}
                  entityId={rc.id}
                  entityName={rc.vehicleNumber}
                  expiryType="RC"
                />
              ),
          )}
          {expiryAlerts.pucExpiring.map(
            (puc) =>
              puc.pucExpiresOn && (
                <ExpiryAlertCard
                  key={puc.id}
                  dueDate={puc.pucExpiresOn}
                  entityId={puc.id}
                  entityName={puc.vehicleNumber}
                  expiryType="PUC"
                />
              ),
          )}
          {expiryAlerts.insuranceExpiring.map(
            (insurance) =>
              insurance.insuranceExpiresOn && (
                <ExpiryAlertCard
                  key={insurance.id}
                  dueDate={insurance.insuranceExpiresOn}
                  entityId={insurance.id}
                  entityName={insurance.vehicleNumber}
                  expiryType="Insurance"
                />
              ),
          )}
          {expiryAlerts.licenseExpiring.map(
            (license) =>
              license.licenseExpiresOn && (
                <ExpiryAlertCard
                  key={license.id}
                  dueDate={license.licenseExpiresOn}
                  entityId={license.id}
                  entityName={license.name}
                  expiryType="License"
                />
              ),
          )}
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
