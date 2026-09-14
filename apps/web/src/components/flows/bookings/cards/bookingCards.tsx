import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoP,
  RyogoH4,
  RyogoSmall,
} from "@/components/typography"
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
import { RyogoPill, TripLogStatusPill } from "@/components/pills/ryogoPills"
import { getCombinedDateTime } from "@/lib/utils"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight, IdCard } from "lucide-react"
import {
  FindCancelledBookingsPreviousDaysType,
  FindCompletedBookingsPreviousDaysType,
  FindLeadBookingsType,
  FindOngoingTripsType,
  FindUpcomingBookingsNextDaysType,
} from "@ryogo-travel-app/api/services/booking.services"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import GetVehicleIcon from "@/components/icons/vehicleIcon"

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
      <div className="flex flex-col gap-2 lg:gap-3 p-3 lg:p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border">
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {booking.id}
          </RyogoCaption>
          {/* <SectionRowWrapper small className="items-center justify-end">
            <RyogoCaption color="light">
              {format(booking.startDate,"MMM DD")+" - "+format(booking.endDate,"MMM DD")}
            </RyogoCaption>
          </SectionRowWrapper> */}
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          <RyogoH4 weight="font-bold">{booking.source.city}</RyogoH4>
          <GetTripTypeIcon
            tripType={booking.type}
            size="sm"
            color="light"
            thick
          />
          <RyogoH4 weight="font-bold">{booking.destination.city}</RyogoH4>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          {booking.assignedVehicle && (
            <SectionRowWrapper small className="items-center">
              {booking.assignedVehicle.vehiclePhotoUrl ? (
                <RyogoImage
                  src={getFileUrl(booking.assignedVehicle.vehiclePhotoUrl)}
                  alt={booking.assignedVehicle.vehicleNumber}
                  imageSize="xs"
                />
              ) : (
                <GetVehicleIcon
                  vehicleType={booking.assignedVehicle.type}
                  size="sm"
                />
              )}
              <RyogoCaption color="slate">
                {booking.assignedVehicle.vehicleNumber}
              </RyogoCaption>
            </SectionRowWrapper>
          )}
          {booking.assignedDriver && (
            <SectionRowWrapper small className="items-center justify-end">
              <RyogoCaption color="slate">
                {booking.assignedDriver.name}
              </RyogoCaption>

              {booking.assignedDriver.user.photoUrl ? (
                <RyogoImage
                  src={getFileUrl(booking.assignedDriver.user.photoUrl)}
                  alt={booking.assignedDriver.name}
                  imageSize="xs"
                />
              ) : (
                <RyogoEnclosedIcon icon={IdCard} size="sm" />
              )}
            </SectionRowWrapper>
          )}
        </SectionRowWrapper>
        <RyogoPill
          label={moment(booking.completedAt).format("lll")}
          bgColor="light"
        />
      </div>
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

export function CancelledBookingCard({
  cancelled,
}: {
  cancelled: FindCancelledBookingsPreviousDaysType[number]
}) {
  return (
    <Link href={`/dashboard/bookings/${cancelled.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{cancelled.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {cancelled.source.city + " - " + cancelled.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.estimatedTotalAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.assignedUser.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          {cancelled.remarks && (
            <RyogoCaption color="slate">{cancelled.remarks}</RyogoCaption>
          )}
          <RyogoP weight="font-bold">
            {moment(cancelled.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

export function LeadBookingCard({
  lead,
}: {
  lead: FindLeadBookingsType[number]
}) {
  return (
    <Link href={`/dashboard/bookings/${lead.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{lead.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {lead.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{lead.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold">
            {lead.source.city + " - " + lead.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {lead.estimatedTotalAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {lead.assignedUser.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{lead.passengers}</RyogoCaption>
          <RyogoP weight="font-bold">{moment(lead.startDate).fromNow()}</RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}
