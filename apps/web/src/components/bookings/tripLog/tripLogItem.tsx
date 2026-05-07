import {
  CaptionGrey,
  Caption,
  Small,
  CaptionBold,
} from "@/components/typography"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  LucideCheckCheck,
  LucideFlagTriangleRight,
  LucideHandshake,
  LucideMapPinCheck,
  LucidePin,
  LucidePlay,
} from "lucide-react"
import { format } from "date-fns"
import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoChinImage } from "@/components/images/ryogoImage"

export default async function TripLogItem({
  tripLog,
}: {
  tripLog: NonNullable<FindBookingTripLogsByIdType>[0]
}) {
  const t = await getTranslations("Dashboard.BookingTripLogs")
  let fileUrl = ""
  if (tripLog.tripLogPhotoUrl) {
    fileUrl = getFileUrl(tripLog.tripLogPhotoUrl)
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          tripLog.tripLogPhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 justify-end w-full">
          <Small>{format(tripLog.createdAt, "dd MMM hh:mm aaa")}</Small>
          <Caption>{tripLog.odometerReading + t("Km")}</Caption>
          <CaptionGrey>{tripLog.latLong}</CaptionGrey>
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2 w-full">
          <Caption>{tripLog.vehicle.vehicleNumber}</Caption>
          <Caption>{tripLog.driver.name}</Caption>
          {tripLog.remarks && <Caption>{tripLog.remarks}</Caption>}
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2 items-end min-w-1/4">
          <div className="flex size-7 lg:size-8 bg-slate-100 rounded-full items-center justify-center">
            {getTripLogIcon(tripLog.type)}
          </div>
          <CaptionBold>{tripLog.type.toUpperCase()}</CaptionBold>
        </div>
      </div>
      {tripLog.tripLogPhotoUrl && (
        <RyogoChinImage src={fileUrl} alt={t("Proof")} />
      )}
    </div>
  )
}

const getTripLogIcon = (type: TripLogTypesEnum) => {
  const className = "size-4 lg:size-5 text-slate-500"
  switch (type) {
    case TripLogTypesEnum.START_TRIP:
      return <LucidePlay className={className} />
    case TripLogTypesEnum.ARRIVED:
      return <LucideMapPinCheck className={className} />
    case TripLogTypesEnum.PICKUP:
      return <LucideHandshake className={className} />
    case TripLogTypesEnum.DROP:
      return <LucideFlagTriangleRight className={className} />
    case TripLogTypesEnum.END_TRIP:
      return <LucideCheckCheck className={className} />
    default:
      return <LucidePin className={className} />
  }
}
