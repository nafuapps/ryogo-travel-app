import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
} from "@/components/page/pageWrappers"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default async function UserDriverDetailsComponent({
  address,
  canDriveVehicles,
  allowance,
  ratings,
  status,
}: {
  address: string | null
  canDriveVehicles: VehicleTypesEnum[]
  allowance: number
  ratings: number[] | null
  status: DriverStatusEnum
}) {
  const t = await getTranslations("Rider.MyProfile")
  return (
    <DetailsBorderWrapper>
      <DetailsContentWrapper>
        {address && <DetailsLineItem label={t("Address")} value={address} />}
        <DetailsLineItem
          label={t("Allowance")}
          value={t("PerDay", { allowance: allowance })}
        />
        <DetailsLineWrapper label={t("CanDrive")}>
          <GetCanDriveIcons canDrive={canDriveVehicles} />
        </DetailsLineWrapper>
        {ratings && (
          <DetailsLineWrapper label={t("Rating")}>
            <RyogoAverageRatingDisplay ratings={ratings} />
          </DetailsLineWrapper>
        )}
        <DriverStatusPill status={status} className="mt-auto" />
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
