import SubscriptionWarningCard from "@/components/flows/susbcription/subscriptionWarningCard"
import VehicleColorBox from "@/components/flows/vehicles/vehicleColorBox"
import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { getAverageRating } from "@/lib/utils"
import { BASIC_PLAN_VEHICLE_LIMIT } from "@ryogo-travel-app/api/apiConfig"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  AirVent,
  Armchair,
  BadgeIndianRupee,
  CircleGauge,
  Star,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

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

async function VehicleItemComponent({
  vehicle,
}: {
  vehicle: FindVehiclesByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <SectionWrapper id={vehicle.id} className="transition hover:opacity-70">
        <SectionRowWrapper className="items-center justify-between">
          {vehicle.vehiclePhotoUrl ? (
            <RyogoImage
              src={getFileUrl(vehicle.vehiclePhotoUrl)}
              alt={vehicle.vehicleNumber}
              imageSize="md"
            />
          ) : (
            <GetVehicleEnclosedIcon vehicleType={vehicle.type} size="lg" />
          )}
          <SectionColWrapper className="w-full">
            <RyogoSmall weight="font-bold"> {vehicle.vehicleNumber}</RyogoSmall>
            <SectionRowWrapper className="items-center">
              <RyogoCaption color="light" weight="font-medium">
                {vehicle.brand + " " + vehicle.model}
              </RyogoCaption>
              <VehicleColorBox color={vehicle.color} />
            </SectionRowWrapper>
            <VehicleStatusPill status={vehicle.status} className="self-start" />
          </SectionColWrapper>
        </SectionRowWrapper>
        <SectionRowWrapper className="items-center justify-between">
          <RyogoTagWithoutBG
            label={t("RatePerKm", { rate: vehicle.defaultRatePerKm })}
            icon={BadgeIndianRupee}
          />
          <RyogoTagWithoutBG
            icon={Armchair}
            label={vehicle.capacity.toString()}
          />
          <RyogoTagWithoutBG
            label={vehicle.odometerReading + t("Km")}
            icon={CircleGauge}
          />
          {vehicle.hasAC && (
            <RyogoTagWithoutBG icon={AirVent} label={t("AC")} />
          )}
          {vehicle.customerRatings && vehicle.customerRatings.length > 0 && (
            <RyogoTagWithoutBG
              label={getAverageRating(vehicle.customerRatings)}
              icon={Star}
            />
          )}
        </SectionRowWrapper>
      </SectionWrapper>
    </Link>
  )
}
