import SubscriptionWarningCard from "@/components/flows/susbcription/subscriptionWarningCard"
import VehicleItemComponent from "@/components/flows/vehicles/home/vehicleItemComponent"
import { TileGridWrapper } from "@/components/page/pageWrappers"
import { BASIC_PLAN_VEHICLE_LIMIT } from "@ryogo-travel-app/api/apiConfig"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"

export default async function AllVehiclesListComponent({
  allVehicles,
  isSubscribed,
  hasTriedSubscription,
}: {
  allVehicles: FindVehiclesByAgencyType
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  return (
    <TileGridWrapper>
      {allVehicles.map((vehicle) => (
        <VehicleItemComponent key={vehicle.id} vehicle={vehicle} />
      ))}
      {!isSubscribed && allVehicles.length >= BASIC_PLAN_VEHICLE_LIMIT && (
        <SubscriptionWarningCard
          warningText={t("Warning")}
          ctaText={hasTriedSubscription ? t("BuyCTA") : t("TryCTA")}
        />
      )}
    </TileGridWrapper>
  )
}
