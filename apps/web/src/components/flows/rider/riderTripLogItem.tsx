import { RyogoSmall, RyogoCaption } from "@/components/typography"
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
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import getTripLogIcon from "@/components/icons/tripLogIcon"

export default async function RiderTripLogItem({
  tripLog,
}: {
  tripLog: NonNullable<FindBookingDetailsByIdType>["tripLogs"][number]
}) {
  const t = await getTranslations("Rider.MyBooking.TripLog")

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row border border-slate-100 dark:border-slate-800 ${
          tripLog.tripLogPhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white dark:bg-slate-900 p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <SectionColWrapper end small>
          <RyogoCaption color="slate">
            {format(tripLog.createdAt, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          <RyogoSmall>{tripLog.odometerReading + t("Km")}</RyogoSmall>
          {tripLog.latLong && (
            <RyogoCaption color="light">{tripLog.latLong}</RyogoCaption>
          )}
          {tripLog.remarks && (
            <RyogoCaption color="slate">{tripLog.remarks}</RyogoCaption>
          )}
        </SectionColWrapper>
        <div className="flex flex-col gap-1.5 lg:gap-2 items-end min-w-1/4">
          <RyogoCaption weight="font-bold">
            {tripLog.type.toUpperCase()}
          </RyogoCaption>
          <RyogoEnclosedIcon
            icon={getTripLogIcon(tripLog.type)}
            size="sm"
            color={
              tripLog.type === TripLogTypesEnum.DROPPED ? "white" : "slate"
            }
            bgColor={
              tripLog.type === TripLogTypesEnum.DROPPED ? "black" : "slate"
            }
            circular
          />
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
