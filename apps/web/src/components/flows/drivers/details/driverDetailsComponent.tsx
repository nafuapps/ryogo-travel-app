import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
} from "@/components/page/pageWrappers"
import moment from "moment"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default async function DriverDetailsComponent({
  email,
  createdAt,
  address,
  canDriveVehicles,
  allowance,
  ratings,
  userId,
}: {
  email: string
  createdAt: Date
  address: string | null
  canDriveVehicles: VehicleTypesEnum[]
  allowance: number
  ratings: number[] | null
  userId: string
}) {
  const t = await getTranslations("Dashboard.DriverDetails")
  return (
    <DetailsBorderWrapper>
      <DetailsContentWrapper>
        <DetailsLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <DetailsLineItem label={t("UserId")} value={userId} />
        <DetailsLineItem label={t("Email")} value={email} />
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
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
