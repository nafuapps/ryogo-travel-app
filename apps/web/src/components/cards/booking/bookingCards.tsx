import {
  GridItemWrapper,
  HoverGridWrapper,
} from "@/components/page/pageWrappers"
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
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import { getCombinedDateTime } from "@/lib/utils"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight } from "lucide-react"
import {
  FindCompletedBookingsPreviousDaysType,
  FindOngoingTripsType,
  FindUpcomingBookingsNextDaysType,
} from "@ryogo-travel-app/api/services/booking.services"

export function CompletedBookingCard({
  booking,
  rider,
}: {
  booking:
    | FindCustomerCompletedBookingsByIdType[number]
    | FindDriverCompletedBookingsByIdType[number]
    | FindVehicleCompletedBookingsByIdType[number]
    | FindUserCompletedBookingsByIdType[number]
    | FindCompletedBookingsPreviousDaysType[number]
  rider?: boolean
}) {
  return (
    <Link
      href={
        rider
          ? `/rider/myBookings/${booking.id}`
          : `/dashboard/bookings/${booking.id}`
      }
      className="w-full"
    >
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {booking.source.city + " - " + booking.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.assignedVehicle?.vehicleNumber}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {booking.assignedDriver?.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(booking.completedAt ?? booking.updatedAt, "PP")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {moment(booking.completedAt ?? booking.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
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
    | FindOngoingTripsType[number]
  rider?: boolean
  startLabel?: string
}) {
  return (
    <Link
      href={
        rider
          ? `/rider/myBookings/${booking.id}`
          : `/dashboard/bookings/${booking.id}`
      }
      className="w-full"
    >
      <HoverGridWrapper highlight={rider} hasChin={rider}>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.id}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {booking.customer.name}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {booking.source.city + " - " + booking.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color={rider ? "white" : "slate"}>
            {booking.assignedVehicle?.vehicleNumber}
          </RyogoCaption>
          <RyogoP color={rider ? "white" : "dark"} weight="font-bold">
            {booking.assignedDriver?.name}
          </RyogoP>
        </GridItemWrapper>
        {booking.tripLogs[0] && (
          <GridItemWrapper>
            <TripLogStatusPill status={booking.tripLogs[0].type} />
          </GridItemWrapper>
        )}
      </HoverGridWrapper>
      {rider && (
        <div className="bg-slate-300 dark:bg-slate-700 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
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
    | FindUpcomingBookingsNextDaysType[number]
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
      href={
        rider
          ? `/rider/myBookings/${booking.id}`
          : `/dashboard/bookings/${booking.id}`
      }
      className="w-full"
    >
      <HoverGridWrapper hasChin={rider && canStart}>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {booking.source.city + " - " + booking.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color={booking.assignedVehicle ? "slate" : "red"}>
            {booking.assignedVehicle?.vehicleNumber ?? "-"}
          </RyogoCaption>
          <RyogoP
            weight="font-bold"
            color={booking.assignedDriver ? "dark" : "red"}
          >
            {booking.assignedDriver?.name ?? "-"}
          </RyogoP>
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
          <div className="bg-slate-300 dark:bg-slate-700 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 px-3 py-2 lg:px-4 lg:py-3">
            <RyogoSmall>{startLabel}</RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="sm" color="black" />
          </div>
        )}
      </HoverGridWrapper>
    </Link>
  )
}
