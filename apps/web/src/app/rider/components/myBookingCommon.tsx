import { gridClassName, gridItemClassName } from "@/components/page/pageCommons"
import {
  SmallBold,
  CaptionGrey,
  P,
  CaptionBold,
  CaptionLight,
  PBold,
  SmallLight,
  Caption,
  PRed,
  Small,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCombinedDateTime } from "@/lib/utils"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import {
  BookingStatusEnum,
  BookingTypeEnum,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"
import { LucideChevronRight } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export function BookingSection({
  sectionTitle,
  children,
}: {
  sectionTitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {children}
      </div>
    </div>
  )
}

export function BookingItem({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <CaptionGrey>{title}</CaptionGrey>
      <P>{value}</P>
    </div>
  )
}

export function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  //One way trip: START_TRIP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType == BookingTypeEnum.OneWay) {
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.DROP)) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.PICKUP)) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.ARRIVED)) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Round trip: START_TRIP->ARRIVED->PICKUP->DROP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType == BookingTypeEnum.Round) {
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length > 1) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length > 1) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length > 1) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length == 1) {
      return TripLogTypesEnum.ARRIVED
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length == 1) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length == 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (
      tripLogs.filter((t) => t.type == TripLogTypesEnum.START_TRIP).length == 1
    ) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Multi day trip: START_TRIP->(ARRIVED->PICKUP->DROP)->END_TRIP
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length ==
    tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length
  ) {
    if (
      endDate <= new Date() &&
      tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length > 0
    ) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length <
    tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length
  ) {
    return TripLogTypesEnum.DROP
  }
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length <
    tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length
  ) {
    return TripLogTypesEnum.PICKUP
  }
  return TripLogTypesEnum.START_TRIP
}

// export function getMaxOdometerReading(
//   tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
// ) {
//   return tripLogs.reduce((accumulator, currentValue) => {
//     return Math.max(accumulator, currentValue.odometerReading)
//   }, 0)
// }

export async function OngoingBookingComponent({
  booking,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
}) {
  const t = await getTranslations("Rider.Home")
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`}>
      <div
        className={`grid text-white bg-slate-900 rounded-t-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-800`}
      >
        <div className={gridItemClassName}>
          <CaptionLight>{booking.bookingId}</CaptionLight>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <CaptionLight>{booking.type.toUpperCase()}</CaptionLight>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <CaptionLight>{booking.vehicle}</CaptionLight>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{booking.status?.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
      <div className="bg-slate-600 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 p-3 lg:p-4">
        <SmallLight>{t("Continue")}</SmallLight>
        <LucideChevronRight className="size-5 lg:size-6 text-slate-100" />
      </div>
    </Link>
  )
}

export async function UpcomingBookingComponent({
  booking,
  canStart,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
  canStart: boolean
}) {
  const t = await getTranslations("Rider.Home")

  const combinedDateTime = getCombinedDateTime(
    booking.startDate,
    booking.startTime!,
  )

  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`} className="w-full">
      <div
        className={`grid border border-slate-100 ${canStart ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-100`}
      >
        <div className={gridItemClassName}>
          <Caption>{booking.bookingId}</Caption>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.vehicle}</Caption>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{format(combinedDateTime, "dd MMM hh:mm aaa")}</Caption>
          {combinedDateTime < new Date() ? (
            <PRed>{moment(combinedDateTime).fromNow()}</PRed>
          ) : (
            <PBold>{moment(combinedDateTime).fromNow()}</PBold>
          )}
        </div>
      </div>
      {canStart && (
        <div className="bg-slate-200 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 p-3 lg:p-4">
          <Small>{t("Start")}</Small>
          <LucideChevronRight className="size-5 lg:size-6 text-slate-700" />
        </div>
      )}
    </Link>
  )
}

export function CompletedBookingComponent({
  booking,
}: {
  booking: FindDriverCompletedBookingsByIdType[number]
}) {
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{booking.bookingId}</Caption>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.vehicle}</Caption>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{format(booking.updatedAt, "PP")}</Caption>
          <PBold>{moment(booking.updatedAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}

export async function BookingCommingInfo({
  booking,
  canCallCustomer,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canCallCustomer: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")
  return (
    <div
      id="MyBookingInfo"
      className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
    >
      <BookingSection sectionTitle={t("BookingInfo")}>
        <BookingItem title={t("BookingId")} value={booking.id} />
        <BookingItem title={t("CustomerName")} value={booking.customer.name} />
        {canCallCustomer && (
          <Button variant={"secondary"} className="sm:col-span-2 xl:col-span-3">
            <Link href={`tel:${booking.customer.phone}`} className="w-full">
              {t("CallCustomer")}
            </Link>
          </Button>
        )}
      </BookingSection>
      <Separator />
      <BookingSection sectionTitle={t("TripInfo")}>
        <BookingItem
          title={t("From")}
          value={booking.source.city + ", " + booking.source.state}
        />
        <BookingItem
          title={t("To")}
          value={booking.destination.city + ", " + booking.destination.state}
        />
        <BookingItem
          title={t("StartDate")}
          value={moment(booking.startDate).format("DD MMM")}
        />
        {booking.pickupAddress && (
          <BookingItem
            title={t("PickupAddress")}
            value={booking.pickupAddress!}
          />
        )}
        {booking.startTime && (
          <BookingItem
            title={t("StartTime")}
            value={moment(booking.startTime!, "hh:mm:ss").format("h:mm a")}
          />
        )}
        {booking.dropAddress && (
          <BookingItem title={t("DropAddress")} value={booking.dropAddress!} />
        )}
        <BookingItem
          title={t("EndDate")}
          value={moment(booking.endDate).format("DD MMM")}
        />
        <BookingItem
          title={t("Distance")}
          value={booking.citydistance + t("Km")}
        />
        <BookingItem
          title={t("TotalDistance")}
          value={booking.totalDistance + t("Km")}
        />
        <BookingItem title={t("Type")} value={booking.type.toUpperCase()} />
        <BookingItem
          title={t("Passengers")}
          value={booking.passengers.toString()}
        />
        <BookingItem
          title={t("NeedsAC")}
          value={booking.needsAc ? t("Yes") : t("No")}
        />
        {booking.remarks && (
          <BookingItem title={t("Remarks")} value={booking.remarks!} />
        )}
      </BookingSection>
    </div>
  )
}
