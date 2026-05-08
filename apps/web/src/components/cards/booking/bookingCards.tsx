import { GridItemWrapper, GridWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { format } from "date-fns"
import {
  FindCustomerCompletedBookingsByIdType,
  FindCustomerUpcomingBookingsByIdType,
} from "@ryogo-travel-app/api/services/customer.services"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import {
  FindVehicleAssignedBookingsByIdType,
  FindVehicleCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import {
  FindUserAssignedBookingsByIdType,
  FindUserCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/user.services"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import { getCombinedDateTime } from "@/lib/utils"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight } from "lucide-react"

export function CompletedBookingCard({
  booking,
  rider,
}: {
  booking:
    | FindCustomerCompletedBookingsByIdType[number]
    | FindDriverCompletedBookingsByIdType[number]
    | FindVehicleCompletedBookingsByIdType[number]
    | FindUserCompletedBookingsByIdType[number]
  rider?: boolean
}) {
  return (
    <Link
      href={`${rider ? `/rider/myBookings/` : `/dashboard/bookings/`}${booking.bookingId}`}
      className="w-full"
    >
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
            {moment(booking.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

export function OngoingBookingCard({
  booking,
  rider,
  startLabel,
}: {
  booking:
    | FindCustomerUpcomingBookingsByIdType[number]
    | FindDriverAssignedBookingsByIdType[number]
    | FindVehicleAssignedBookingsByIdType[number]
    | FindUserAssignedBookingsByIdType[number]
  rider?: boolean
  startLabel?: string
}) {
  return (
    <Link
      href={`${rider ? `/rider/myBookings/` : `/dashboard/bookings/`}${booking.bookingId}`}
      className="w-full"
    >
      <GridWrapper highlight={rider} hasChin={rider}>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.bookingId}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {" "}
            {booking.customerName}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {" "}
            {booking.route}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.vehicle}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {" "}
            {booking.driver}
          </RyogoP>
        </GridItemWrapper>
        {booking.status && (
          <GridItemWrapper>
            <TripLogStatusPill status={booking.status} />
          </GridItemWrapper>
        )}
      </GridWrapper>
      {rider && (
        <div className="bg-slate-200 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
          <RyogoSmall>{startLabel}</RyogoSmall>
          <RyogoIcon icon={ChevronRight} size="sm" color="black" />
        </div>
      )}
    </Link>
  )
}

export function UpcomingBookingCard({
  booking,
  rider,
  canStart,
  startLabel,
}: {
  booking:
    | FindCustomerUpcomingBookingsByIdType[number]
    | FindDriverAssignedBookingsByIdType[number]
    | FindVehicleAssignedBookingsByIdType[number]
    | FindUserAssignedBookingsByIdType[number]
  rider?: boolean
  canStart?: boolean
  startLabel?: string
}) {
  const combinedDateTime = getCombinedDateTime(
    booking.startDate,
    booking.startTime,
  )

  return (
    <Link
      href={`${rider ? `/rider/myBookings/` : `/dashboard/bookings/`}${booking.bookingId}`}
      className="w-full"
    >
      <GridWrapper hasChin={rider && canStart}>
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
              {moment(combinedDateTime).fromNow()}
            </RyogoP>
          )}
        </GridItemWrapper>
        {rider && canStart && (
          <div className="bg-slate-200 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
            <RyogoSmall>{startLabel}</RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="sm" color="black" />
          </div>
        )}
      </GridWrapper>
    </Link>
  )
}
