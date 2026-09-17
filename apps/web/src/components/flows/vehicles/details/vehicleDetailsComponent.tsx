import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
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

export default async function VehicleDetailsComponent({
  id,
  createdAt,
  type,
  brand,
  color,
  model,
  odometer,
  capacity,
  hasAC,
  rate,
  acCharge,
  ratings,
}: {
  id: string
  createdAt: Date
  type: VehicleTypesEnum
  brand: VehicleBrandEnum
  color: VehicleColorEnum
  model: string
  odometer: number
  capacity: number
  hasAC: boolean
  rate: number
  acCharge: number
  ratings: number[] | null
}) {
  const t = await getTranslations("Dashboard.VehicleDetails")
  return (
    <DetailsBorderWrapper>
      <DetailsHeaderWrapper>
        <DetailsIDWrapper id={id} label={t("VehicleId")} />
      </DetailsHeaderWrapper>
      <DetailsContentWrapper>
        <DetailsLineItem
          label={t("Added")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <DetailsLineItem label={t("Type")} value={type} />
        <DetailsLineItem label={t("Brand")} value={brand} />
        <DetailsLineItem label={t("Model")} value={model} />
        <DetailsLineItem label={t("Color")} value={color} />
        <DetailsLineItem
          label={t("Odometer")}
          value={t("Reading", { odometer: odometer })}
        />
        <DetailsLineItem
          label={t("Capacity")}
          value={t("Seater", { capacity: capacity })}
        />
        <DetailsLineItem label={t("AC")} value={hasAC ? t("Yes") : t("No")} />
        <DetailsLineItem
          label={t("Rate")}
          value={t("RatePerKm", { rate: rate })}
        />
        {hasAC && (
          <DetailsLineItem
            label={t("ACCharge")}
            value={t("ChargePerDay", { charge: acCharge })}
          />
        )}
        {ratings && (
          <DetailsLineWrapper label={t("Rating")}>
            <SectionRowWrapper className="items-center justify-end">
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
