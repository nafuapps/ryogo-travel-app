import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  Rows3,
  AirVent,
  Armchair,
  BadgeIndianRupee,
  CircleGauge,
  Star,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import {
  SectionColWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import VehicleColorBox from "@/components/flows/vehicles/vehicleColorBox"
import { BASIC_PLAN_VEHICLE_LIMIT } from "@/lib/uiConfig"
import SubscriptionWarningCard from "@/components/flows/susbcription/subscriptionWarningCard"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { getAverageRating } from "@/lib/utils"

export default async function AllVehiclesListComponent({
  allVehicles,
  isBasic,
  hasTriedSubscription,
}: {
  allVehicles: FindVehiclesByAgencyType
  isBasic: boolean
  hasTriedSubscription: boolean
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  return (
    <SectionWrapper id="AllVehiclesSection">
      <SectionHeaderWrapper
        icon={Rows3}
        label={t("Title")}
        count={allVehicles.length}
      />
      <TileGridWrapper>
        {allVehicles.map((vehicle) => (
          <VehicleItemComponent key={vehicle.id} vehicle={vehicle} />
        ))}
        {isBasic && allVehicles.length >= BASIC_PLAN_VEHICLE_LIMIT && (
          <SubscriptionWarningCard
            warningText={t("Warning")}
            ctaText={hasTriedSubscription ? t("BuyCTA") : t("TryCTA")}
          />
        )}
      </TileGridWrapper>
    </SectionWrapper>
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
      <SectionColWrapper className="h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
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
            <RyogoP weight="font-bold"> {vehicle.vehicleNumber}</RyogoP>
            <SectionRowWrapper className="items-center">
              <RyogoCaption color="light" weight="font-medium">
                {vehicle.brand + " " + vehicle.model}
              </RyogoCaption>
              <VehicleColorBox color={vehicle.color} />
            </SectionRowWrapper>
            <VehicleStatusPill status={vehicle.status} className="self-start" />
          </SectionColWrapper>
        </SectionRowWrapper>
        <SectionRowWrapper className="p-2 lg:p-3 border rounded-md items-center justify-between">
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
      </SectionColWrapper>
    </Link>
  )
}
