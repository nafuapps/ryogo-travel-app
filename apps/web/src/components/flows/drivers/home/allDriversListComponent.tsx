import DriverItemComponent from "@/components/flows/drivers/home/driverItemComponent"
import SubscriptionWarningCard from "@/components/flows/susbcription/subscriptionWarningCard"
import { TileGridWrapper } from "@/components/page/pageWrappers"
import { BASIC_PLAN_DRIVER_LIMIT } from "@ryogo-travel-app/api/apiConfig"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"

export default async function AllDriversListComponent({
  allDrivers,
  isSubscribed,
  hasTriedSubscription,
}: {
  allDrivers: FindDriversByAgencyType
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = await getTranslations("Dashboard.Drivers.All")

  return (
    <TileGridWrapper>
      {allDrivers.map((driver) => (
        <DriverItemComponent key={driver.id} driver={driver} />
      ))}
      {!isSubscribed && allDrivers.length >= BASIC_PLAN_DRIVER_LIMIT && (
        <SubscriptionWarningCard
          warningText={t("Warning")}
          ctaText={hasTriedSubscription ? t("BuyCTA") : t("TryCTA")}
        />
      )}
    </TileGridWrapper>
  )
}
