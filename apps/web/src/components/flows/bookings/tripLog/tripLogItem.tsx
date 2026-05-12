import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  CheckCheck,
  FlagTriangleRight,
  Handshake,
  MapPinCheck,
  Pin,
  Play,
} from "lucide-react"
import { format } from "date-fns"
import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoChinImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"

export default async function TripLogItem({
  tripLog,
}: {
  tripLog: NonNullable<FindBookingTripLogsByIdType>[0]
}) {
  const t = await getTranslations("Dashboard.BookingTripLogs")

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          tripLog.tripLogPhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 justify-end w-full">
          <RyogoSmall>
            {format(tripLog.createdAt, "dd MMM hh:mm aaa")}
          </RyogoSmall>
          <RyogoCaption color="slate">
            {tripLog.odometerReading + t("Km")}
          </RyogoCaption>
          <RyogoCaption color="light">{tripLog.latLong}</RyogoCaption>
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2 w-full">
          <RyogoCaption color="slate">
            {tripLog.vehicle.vehicleNumber}
          </RyogoCaption>
          <RyogoCaption color="slate">{tripLog.driver.name}</RyogoCaption>
          {tripLog.remarks && (
            <RyogoCaption color="slate">{tripLog.remarks}</RyogoCaption>
          )}
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2 items-end min-w-1/4">
          {getTripLogIcon(tripLog.type)}
          <RyogoCaption color="dark" weight="font-bold">
            {tripLog.type.toUpperCase()}
          </RyogoCaption>
        </div>
      </div>
      {tripLog.tripLogPhotoUrl && (
        <RyogoChinImage
          src={getFileUrl(tripLog.tripLogPhotoUrl)}
          alt={t("Proof")}
        />
      )}
    </div>
  )
}

const getTripLogIcon = (type: TripLogTypesEnum) => {
  switch (type) {
    case TripLogTypesEnum.START_TRIP:
      return <RyogoEnclosedIcon icon={Play} size="sm" circular />

    case TripLogTypesEnum.ARRIVED:
      return <RyogoEnclosedIcon icon={MapPinCheck} size="sm" circular />

    case TripLogTypesEnum.PICKUP:
      return <RyogoEnclosedIcon icon={Handshake} size="sm" circular />

    case TripLogTypesEnum.DROP:
      return <RyogoEnclosedIcon icon={FlagTriangleRight} size="sm" circular />

    case TripLogTypesEnum.END_TRIP:
      return <RyogoEnclosedIcon icon={CheckCheck} size="sm" circular />
    default:
      return <RyogoEnclosedIcon icon={Pin} size="sm" circular />
  }
}
