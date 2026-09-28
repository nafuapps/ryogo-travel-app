import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import {
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindAgencyExpiryAlertsType } from "@ryogo-travel-app/api/services/agency.services"
import { getTranslations } from "next-intl/server"

export default async function ExpiryAlertsPageComponent({
  expiryAlerts,
}: {
  expiryAlerts?: FindAgencyExpiryAlertsType
}) {
  const t = await getTranslations("Dashboard.Missions.ExpiryAlerts")

  const expiryAlertsCount = expiryAlerts
    ? expiryAlerts.driverLeaveAlerts.length +
      expiryAlerts.vehicleRepairAlerts.length +
      expiryAlerts.pucExpiring.length +
      expiryAlerts.rcExpiring.length +
      expiryAlerts.insuranceExpiring.length
    : 0

  return (
    <PageWrapper id="ExpiryAlertsPage">
      {expiryAlerts && (
        <RyogoCarouselWrapper count={t("Header", { count: expiryAlertsCount })}>
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
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-missions"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
