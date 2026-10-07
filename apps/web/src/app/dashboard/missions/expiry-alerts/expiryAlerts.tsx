import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import ExpiryAlertCard from "@/components/missions/expiryAlertCard"
import {
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { FindAgencyExpiryAlertsType } from "@ryogo-travel-app/api/services/agency.services"
import { AlarmClockMinus } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function ExpiryAlertsPageComponent({
  expiryAlerts,
}: {
  expiryAlerts?: FindAgencyExpiryAlertsType
}) {
  const t = await getTranslations("Dashboard.Missions.ExpiryAlerts")

  const expiryAlertsCount = expiryAlerts
    ? expiryAlerts.licenseExpiring.length +
      expiryAlerts.pucExpiring.length +
      expiryAlerts.rcExpiring.length +
      expiryAlerts.insuranceExpiring.length
    : 0

  return (
    <PageWrapper id="ExpiryAlertsPage">
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {t("Alerts") + " (" + expiryAlertsCount + ")"}
        </RyogoCaption>
      </SectionRowWrapper>
      {expiryAlerts && expiryAlertsCount > 0 ? (
        <>
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
        </>
      ) : (
        <EmptyStateIcon icon={AlarmClockMinus} label={t("NoAlerts")} />
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
