"use client"

import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import ExpiryAlertsFiltersCard from "@/components/filter/expiryAlertsFiltersCard"
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
import { Route } from "next"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function ExpiryAlertsPageComponent({
  expiryAlerts,
}: {
  expiryAlerts: FindAgencyExpiryAlertsType
}) {
  const t = useTranslations("Dashboard.ExpiryAlerts")

  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const expired = searchParams.get("expired")

  const filteredLicenseExpiring = expiryAlerts?.licenseExpiring.filter(
    (license) => {
      return checkFilteredItem(
        "License",
        license.licenseExpiresOn,
        type,
        expired,
      )
    },
  )

  const filteredPUCExpiring = expiryAlerts?.pucExpiring.filter((puc) => {
    return checkFilteredItem("PUC", puc.pucExpiresOn, type, expired)
  })

  const filteredRCExpiring = expiryAlerts?.rcExpiring.filter((rc) => {
    return checkFilteredItem("RC", rc.rcExpiresOn, type, expired)
  })

  const filteredInsuranceExpiring = expiryAlerts?.insuranceExpiring.filter(
    (insurance) => {
      return checkFilteredItem(
        "Insurance",
        insurance.insuranceExpiresOn,
        type,
        expired,
      )
    },
  )

  const expiryAlertsCount = expiryAlerts
    ? filteredLicenseExpiring.length +
      filteredPUCExpiring.length +
      filteredRCExpiring.length +
      filteredInsuranceExpiring.length
    : 0

  return (
    <PageWrapper id="ExpiryAlertsPage">
      <ExpiryAlertsFiltersCard />
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {searchParams.size === 0
            ? t("AllAlerts", { count: expiryAlertsCount })
            : t("FilteredAlerts", { count: expiryAlertsCount })}
        </RyogoCaption>
        <RyogoGhostButton
          label={t("ClearFilters")}
          labelColor="light"
          onClick={() => router.push(pathname as Route)}
          disabled={searchParams.size === 0}
        />
      </SectionRowWrapper>
      {expiryAlerts && expiryAlertsCount > 0 ? (
        <>
          {filteredRCExpiring.map(
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
          {filteredPUCExpiring.map(
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
          {filteredInsuranceExpiring.map(
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
          {filteredLicenseExpiring.map(
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

function checkFilteredItem(
  itemType: string,
  itemExpiryDate: Date | null,
  type: string | null,
  expired: string | null,
) {
  return (
    itemExpiryDate &&
    (type === null || itemType === type) &&
    (expired === null || itemExpiryDate < new Date() === (expired === "True"))
  )
}
