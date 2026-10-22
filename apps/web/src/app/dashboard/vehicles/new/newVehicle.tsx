import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import { PageWrapper } from "@/components/page/pageWrappers"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import NewVehicleForm from "./newVehicleForm"

export default async function NewVehiclePageComponent({
  agencyId,
  userId,
  isOwner,
  isSubscribed,
  hasTriedSubscription,
  subscriptionExpiresOn,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
  subscriptionExpiresOn: Date
}) {
  const t = await getTranslations("Dashboard.NewVehicle")

  const vehicles = await vehicleServices.findExistingVehiclesInAgency(agencyId)

  const currentAgencyVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== VehicleStatusEnum.SUSPENDED,
  ).length

  //SUBSCRIPTION BLOCKER: Only allow subscribed agencies to add more than X vehicles
  if (
    !APP_TRIAL_MODE &&
    currentAgencyVehicles >= BASIC_PLAN_VEHICLE_LIMIT &&
    (!isSubscribed || subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewVehiclePage">
        <SubscriptionBlockerSection
          warningText={!isSubscribed ? t("TrialWarning") : t("ExpiredWarning")}
          actionText={!isSubscribed ? t("TrialAction") : t("ExpiredAction")}
          isOwner={isOwner}
          ctaLabel={
            !isSubscribed
              ? hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
      </PageWrapper>
    )
  }

  return (
    <NewVehicleForm
      agencyId={agencyId}
      existingVehicles={vehicles}
      userId={userId}
    />
  )
}
