import { PageWrapper } from "@/components/page/pageWrappers"
import NewVehicleForm from "./newVehicleForm"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  SubscriptionPlanEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE, BASIC_PLAN_VEHICLE_LIMIT } from "@/lib/uiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { getTranslations } from "next-intl/server"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function NewVehiclePageComponent({
  agencyId,
  isOwner,
}: {
  agencyId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.NewVehicle")

  const vehicles = await vehicleServices.findExistingVehiclesInAgency(agencyId)

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  const currentAgencyVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== VehicleStatusEnum.SUSPENDED,
  ).length

  //SUBSCRIPTION BLOCKER: Only allow subscribed agencies to add more than X vehicles
  if (
    !APP_TRIAL_MODE &&
    currentAgencyVehicles >= BASIC_PLAN_VEHICLE_LIMIT &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewVehiclePage">
        <SubscriptionBlockerSection
          warningText={isBasic ? t("TrialWarning") : t("ExpiredWarning")}
          actionText={isBasic ? t("TrialAction") : t("ExpiredAction")}
          isOwner={isOwner}
          ctaLabel={
            isBasic
              ? agency.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="NewVehiclePage">
      <NewVehicleForm agencyId={agencyId} existingVehicles={vehicles} />
    </PageWrapper>
  )
}
