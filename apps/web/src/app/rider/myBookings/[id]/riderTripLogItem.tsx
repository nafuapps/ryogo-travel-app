import {
  Small,
  CaptionGrey,
  CaptionBold,
  Caption,
} from "@/components/typography"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"
import Image from "next/image"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  LucidePlay,
  LucideMapPinCheck,
  LucideHandshake,
  LucideFlagTriangleRight,
  LucideCheckCheck,
  LucidePin,
} from "lucide-react"

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
        <div className="flex justify-center items-center overflow-hidden bg-slate-200 rounded-b-lg p-1.5 lg:p-2">
          <Dialog>
            <DialogTrigger className="w-full hover:underline hover:cursor-pointer">
              <CaptionGrey>{t("Proof")}</CaptionGrey>
            </DialogTrigger>
            <DialogContent className="size-10/12">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <Image
                src={fileUrl}
                alt={t("Proof")}
                fill
                className="object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

function getTripLogIcon(type: TripLogTypesEnum) {
  const className = "size-4 lg:size-5 text-slate-500"
  switch (type) {
    case TripLogTypesEnum.START_TRIP:
      return (
        <div className="flex size-7 lg:size-8 bg-slate-100 rounded-full items-center justify-center">
          <LucidePlay className={className} />
        </div>
      )
    case TripLogTypesEnum.ARRIVED:
      return (
        <div className="flex size-7 lg:size-8 bg-amber-100 rounded-full items-center justify-center">
          <LucideMapPinCheck className={className} />
        </div>
      )
    case TripLogTypesEnum.PICKUP:
      return (
        <div className="flex size-7 lg:size-8 bg-indigo-100 rounded-full items-center justify-center">
          <LucideHandshake className={className} />
        </div>
      )
    case TripLogTypesEnum.DROP:
      return (
        <div className="flex size-7 lg:size-8 bg-green-100 rounded-full items-center justify-center">
          <LucideFlagTriangleRight className={className} />
        </div>
      )
    case TripLogTypesEnum.END_TRIP:
      return (
        <div className="flex size-7 lg:size-8 bg-slate-700 rounded-full items-center justify-center">
          <LucideCheckCheck className={"size-4 lg:size-5 text-slate-100"} />
        </div>
      )
    default:
      return (
        <div className="flex size-7 lg:size-8 bg-slate-100 rounded-full items-center justify-center">
          <LucidePin className={className} />
        </div>
      )
  }
}
