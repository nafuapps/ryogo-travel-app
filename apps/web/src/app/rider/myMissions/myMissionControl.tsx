import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import MissionCard from "@/components/missions/missionCard"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { differenceInDays } from "date-fns"
import { CalendarPlus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { EXPIRATION_ALERT_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"

export default async function MyMissionControlPageComponent({
  missions,
  isPremium,
  driver,
  assignedVehicle,
}: {
  missions: FindMissionsByUserIdType
  isPremium: boolean
  driver: NonNullable<FindDriverByUserIdType>
  assignedVehicle: FindAssignedVehicleByDriverIdType
}) {
  const t = await getTranslations("Dashboard.MissionControl")
  const criticalMissions = missions.filter((mission) => mission.isCritical)
  const otherMissions = missions.filter((mission) => !mission.isCritical)

  const showLicenseAlert = showAlert(driver.licenseExpiresOn)
  let alertCount = showLicenseAlert ? 1 : 0

  let showVehicleRCAlert = false
  let showVehiclePUCAlert = false
  let showVehicleInsuranceAlert = false

  if (assignedVehicle) {
    showVehicleRCAlert = showAlert(assignedVehicle.rcExpiresOn)
    if (showVehicleRCAlert) alertCount += 1
    showVehiclePUCAlert = showAlert(assignedVehicle.pucExpiresOn)
    if (showVehiclePUCAlert) alertCount += 1
    showVehicleInsuranceAlert = showAlert(assignedVehicle.insuranceExpiresOn)
    if (showVehicleInsuranceAlert) alertCount += 1
  }

  return (
    <PageWrapper id="MyMissionControlPage">
      {isPremium && (
        <Link href={`/rider/myMissions/add`} className="self-center">
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
      {alertCount > 0 && (
        <RyogoCarouselWrapper
          count={t("ExpiryAlerts.Header", { count: alertCount })}
        >
          {showLicenseAlert && driver.licenseExpiresOn && (
            <ExpiryAlertCard
              dueDate={driver.licenseExpiresOn}
              entityId={driver.id}
              entityName={driver.name}
              expiryType="License"
              isDriver
            />
          )}
          {showVehicleRCAlert && assignedVehicle?.rcExpiresOn && (
            <ExpiryAlertCard
              dueDate={assignedVehicle.rcExpiresOn}
              entityId={assignedVehicle.id}
              entityName={assignedVehicle.vehicleNumber}
              expiryType="RC"
              isDriver
            />
          )}
          {showVehiclePUCAlert && assignedVehicle?.pucExpiresOn && (
            <ExpiryAlertCard
              dueDate={assignedVehicle.pucExpiresOn}
              entityId={assignedVehicle.id}
              entityName={assignedVehicle.vehicleNumber}
              expiryType="PUC"
              isDriver
            />
          )}
          {showVehicleInsuranceAlert && assignedVehicle?.insuranceExpiresOn && (
            <ExpiryAlertCard
              dueDate={assignedVehicle.insuranceExpiresOn}
              entityId={assignedVehicle.id}
              entityName={assignedVehicle.vehicleNumber}
              expiryType="Insurance"
              isDriver
            />
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

function showAlert(date: Date | null) {
  if (!date) return false
  return differenceInDays(date, new Date()) < EXPIRATION_ALERT_WINDOW_DAYS
}
