import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCombinedDateTime } from "@/lib/utils"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { BookingTypeEnum, TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  ContentWrapper,
  GridItemWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "../icons/RyogoIcon"

export function BookingSection({
  sectionTitle,
  children,
}: {
  sectionTitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <RyogoSmall weight="font-bold">{sectionTitle}</RyogoSmall>
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
      <RyogoCaption color="light">{title}</RyogoCaption>
      <RyogoP>{value}</RyogoP>
    </div>
  )
}

export function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  //One way trip: START_TRIP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType === BookingTypeEnum.OneWay) {
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.DROP)) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.PICKUP)) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.ARRIVED)) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Round trip: START_TRIP->ARRIVED->PICKUP->DROP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType === BookingTypeEnum.Round) {
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length > 1) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length > 1) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length > 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length === 1) {
      return TripLogTypesEnum.ARRIVED
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length === 1
    ) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length === 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.START_TRIP).length ===
      1
    ) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Multi day trip: START_TRIP->(ARRIVED->PICKUP->DROP)->END_TRIP
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length ==
    tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length
  ) {
    if (
      endDate <= new Date() &&
      tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length > 0
    ) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length <
    tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length
  ) {
    return TripLogTypesEnum.DROP
  }
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length <
    tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length
  ) {
    return TripLogTypesEnum.PICKUP
  }
  return TripLogTypesEnum.START_TRIP
}

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
        <GridItemWrapper>
          <RyogoCaption color="white">{booking.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="white">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {booking.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="white">{booking.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.driver}</RyogoP>
        </GridItemWrapper>
        {booking.status && (
          <GridItemWrapper>
            <TripLogStatusPill status={booking.status} />
          </GridItemWrapper>
        )}
      </div>
      <div className="bg-slate-600 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
        <RyogoSmall color="white">{t("Continue")}</RyogoSmall>
        <RyogoIcon icon={ChevronRight} size="sm" color="white" />
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
    booking.startTime,
  )

  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`} className="w-full">
      <div
        className={`grid border border-slate-100 ${canStart ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-100`}
      >
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {booking.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.driver}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(combinedDateTime, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          {combinedDateTime < new Date() ? (
            <RyogoP color="red">{moment(combinedDateTime).fromNow()}</RyogoP>
          ) : (
            <RyogoP weight="font-bold">
              {" "}
              {moment(combinedDateTime).fromNow()}
            </RyogoP>
          )}
        </GridItemWrapper>
      </div>
      {canStart && (
        <div className="bg-slate-200 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
          <RyogoSmall>{t("Start")}</RyogoSmall>
          <RyogoIcon icon={ChevronRight} size="sm" color="black" />
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
      <GridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {booking.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.driver}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(booking.updatedAt, "PP")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(booking.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

export async function BookingCommonInfo({
  booking,
  canCallCustomer,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canCallCustomer: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")
  return (
    <ContentWrapper id="MyBookingInfo">
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
            value={booking.pickupAddress}
          />
        )}
        {booking.startTime && (
          <BookingItem
            title={t("StartTime")}
            value={moment(booking.startTime, "hh:mm:ss").format("h:mm a")}
          />
        )}
        {booking.dropAddress && (
          <BookingItem title={t("DropAddress")} value={booking.dropAddress} />
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
          <BookingItem title={t("Remarks")} value={booking.remarks} />
        )}
      </BookingSection>
    </ContentWrapper>
  )
}
