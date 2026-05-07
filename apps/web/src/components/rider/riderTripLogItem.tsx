import {
  Small,
  CaptionGrey,
  CaptionBold,
  Caption,
} from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  Play,
  MapPinCheck,
  Handshake,
  FlagTriangleRight,
  CheckCheck,
  Pin,
} from "lucide-react"
import { RyogoChinImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function RiderTripLogItem({
  tripLog,
}: {
  tripLog: NonNullable<FindBookingDetailsByIdType>["tripLogs"][number]
}) {
  const t = await getTranslations("Rider.MyBooking.TripLog")
  let fileUrl = ""
  if (tripLog.tripLogPhotoUrl) {
    fileUrl = getFileUrl(tripLog.tripLogPhotoUrl)
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row border border-slate-100 ${
          tripLog.tripLogPhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 justify-end w-full">
          <Caption>{format(tripLog.createdAt, "dd MMM hh:mm aaa")}</Caption>
          <Small>{tripLog.odometerReading + t("Km")}</Small>
          <CaptionGrey>{tripLog.latLong}</CaptionGrey>
          {tripLog.remarks && <Caption>{tripLog.remarks}</Caption>}
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2 items-end min-w-1/4">
          <CaptionBold>{tripLog.type.toUpperCase()}</CaptionBold>
          {getTripLogIcon(tripLog.type)}
        </div>
      </div>
      {tripLog.tripLogPhotoUrl && (
        <RyogoChinImage src={fileUrl} alt={t("Proof")} />
      )}
    </div>
  )
}

function getTripLogIcon(type: TripLogTypesEnum) {
  let icon = Pin
  let last = false

  if (type === TripLogTypesEnum.START_TRIP) {
    icon = Play
  }
  if (type === TripLogTypesEnum.ARRIVED) {
    icon = MapPinCheck
  }
  if (type === TripLogTypesEnum.PICKUP) {
    icon = Handshake
  }
  if (type === TripLogTypesEnum.DROP) {
    icon = FlagTriangleRight
  }
  if (type === TripLogTypesEnum.END_TRIP) {
    icon = CheckCheck
    last = true
  }
  return (
    <div
      className={`flex size-7 lg:size-8 ${last ? "bg-slate-800" : "bg-slate-100"} rounded-full items-center justify-center`}
    >
      <RyogoIcon icon={icon} size="sm" />
    </div>
  )
}
