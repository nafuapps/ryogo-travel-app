import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  SectionRowWrapper,
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsIDWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getAverageRating } from "@/lib/utils"
import { Star } from "lucide-react"

export default async function UserDriverDetailsComponent({
  id,
  address,
  canDriveVehicles,
  allowance,
  ratings,
  status,
}: {
  id: string
  address: string | null
  canDriveVehicles: VehicleTypesEnum[]
  allowance: number
  ratings: number[] | null
  status: DriverStatusEnum
}) {
  const t = await getTranslations("Rider.MyProfile")
  return (
    <DetailsBorderWrapper>
      <DetailsIDWrapper id={id} label={t("DriverId")} />
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
        <DriverStatusPill status={status} className="mt-auto" />
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
