import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
} from "@/components/page/pageWrappers"
import moment from "moment"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default async function VehicleDetailsComponent({
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
            <RyogoAverageRatingDisplay ratings={ratings} />
          </DetailsLineWrapper>
        )}
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
