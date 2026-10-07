import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import {
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { EXPIRATION_ALERT_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { differenceInDays } from "date-fns"
import { AlarmClockMinus } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function MyExpiryAlertsPageComponent({
  driver,
  assignedVehicle,
}: {
  driver: NonNullable<FindDriverByUserIdType>
  assignedVehicle: FindAssignedVehicleByDriverIdType
}) {
  const t = await getTranslations("Dashboard.Missions.ExpiryAlerts")

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
    <PageWrapper id="ExpiryAlertsPage">
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {t("Alerts") + " (" + alertCount + ")"}
        </RyogoCaption>
      </SectionRowWrapper>
      {alertCount > 0 ? (
        <>
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
        </>
      ) : (
        <EmptyStateIcon icon={AlarmClockMinus} label={t("NoAlerts")} />
      )}
      <StickyActionWrapper>
        <HelpIconButton
          href={"/rider/mySupport/help-missions"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

function showAlert(date: Date | null) {
  if (!date) return false
  return differenceInDays(date, new Date()) < EXPIRATION_ALERT_WINDOW_DAYS
}
