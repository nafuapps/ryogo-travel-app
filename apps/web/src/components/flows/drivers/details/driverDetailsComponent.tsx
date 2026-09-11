import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsIDWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getAverageRating } from "@/lib/utils"
import { Star } from "lucide-react"
import moment from "moment"

export default async function DriverDetailsComponent({
  id,
  phone,
  email,
  createdAt,
  address,
  canDriveVehicles,
  allowance,
  ratings,
  userId,
}: {
  id: string
  phone: string
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
      <DetailsIDWrapper id={id} label={t("DriverId")} />
      <DetailsContentWrapper>
        <DetailsLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <DetailsLineItem label={t("UserId")} value={userId} />
        <DetailsLineItem label={t("Email")} value={email} />
        <DetailsLineItem label={t("Phone")} value={phone} />
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
            <SectionRowWrapper justifyEnd center>
              <div className="border rounded-md flex items-center gap-1 lg:gap-1.5 py-0.75 lg:py-1 px-1.5 lg:px-2">
                <RyogoCaption color="slate">
                  {getAverageRating(ratings)}
                </RyogoCaption>
                <RyogoIcon icon={Star} size={"xs"} />
              </div>
              <RyogoCaption color="slate">
                {t("RatingCount", { count: ratings.length })}
              </RyogoCaption>
            </SectionRowWrapper>
          </DetailsLineWrapper>
        )}
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
