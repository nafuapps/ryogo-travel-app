import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import moment from "moment"
import Link from "next/link"
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
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  BookX,
  CheckCheck,
  ChevronRight,
  Clock,
  ClockPlus,
  IdCard,
  MapPin,
} from "lucide-react"
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
import { BookingTypeEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

function BookingCardWrapper({
  bookingId,
  isRider,
  children,
  className,
}: {
  bookingId: string
  isRider?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={
        isRider
          ? `/rider/myBookings/${bookingId}`
          : `/dashboard/bookings/${bookingId}`
      }
      className="w-full"
    >
      <SectionColWrapper
        className={`rounded-sm overflow-hidden transition bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border ${className ?? ""}`}
      >
        {children}
      </SectionColWrapper>
    </Link>
  )
}

function BookingCardHeaderWrapper({
  bookingId,
  children,
}: {
  bookingId: string
  children: React.ReactNode
}) {
  return (
    <SectionRowWrapper className="items-center justify-between p-3 lg:p-4 bg-slate-200 dark:bg-slate-800">
      <RyogoCaption color="light" weight="font-bold">
        {bookingId}
      </RyogoCaption>
      {children}
    </SectionRowWrapper>
  )
}

function BookingCardBottomWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SectionRowWrapper className="items-center justify-between px-3 lg:px-4 pb-2 lg:pb-3">
      {children}
    </SectionRowWrapper>
  )
}

function BookingCardStartWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SectionRowWrapper
      small
      className="bg-slate-700 dark:bg-slate-300 rounded-b items-center justify-center p-3 lg:p-4"
    >
      {children}
    </SectionRowWrapper>
  )
}

function BookingCardTagWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <SectionRowWrapper
      small
      className={`items-center justify-center rounded bg-slate-200 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5 ${className ?? ""}`}
    >
      {children}
    </SectionRowWrapper>
  )
}

function BookingCardRouteWrapper({
  source,
  destination,
  type,
}: {
  source: string
  destination: string
  type: BookingTypeEnum
}) {
  return (
    <SectionRowWrapper
      small
      className="items-center justify-between px-3 lg:px-4"
    >
      <RyogoH4 weight="font-bold">{source}</RyogoH4>
      <GetTripTypeIcon tripType={type} size="sm" color="black" thick />
      <RyogoH4 weight="font-bold">{destination}</RyogoH4>
    </SectionRowWrapper>
  )
}

function BookingCardAssignedWrapper({
  assignedVehicle,
  assignedDriver,
}: {
  assignedVehicle: {
    vehicleNumber: string
    vehiclePhotoUrl: string | null
    type: VehicleTypesEnum
  } | null
  assignedDriver: {
    name: string
    user: {
      photoUrl: string | null
    }
  } | null
}) {
  return (
    <SectionRowWrapper
      small
      className="items-center justify-between px-3 lg:px-4"
    >
      {assignedVehicle && (
        <SectionRowWrapper small className="items-center">
          {assignedVehicle.vehiclePhotoUrl ? (
            <RyogoImage
              src={getFileUrl(assignedVehicle.vehiclePhotoUrl)}
              alt={assignedVehicle.vehicleNumber}
              imageSize="xs"
            />
          ) : (
            <GetVehicleIcon vehicleType={assignedVehicle.type} size="sm" />
          )}
          <RyogoCaption color="slate">
            {assignedVehicle.vehicleNumber}
          </RyogoCaption>
        </SectionRowWrapper>
      )}
      {assignedDriver && (
        <SectionRowWrapper small className="items-center justify-end">
          <RyogoCaption color="slate">{assignedDriver.name}</RyogoCaption>

          {assignedDriver.user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(assignedDriver.user.photoUrl)}
              alt={assignedDriver.name}
              imageSize="xs"
            />
          ) : (
            <RyogoEnclosedIcon icon={IdCard} size="sm" />
          )}
        </SectionRowWrapper>
      )}
    </SectionRowWrapper>
  )
}

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
    <BookingCardWrapper isRider={rider} bookingId={booking.id}>
      <BookingCardHeaderWrapper bookingId={booking.id}>
        <RyogoCaption color={"light"}>
          {moment(booking.actualStartDate ?? booking.startDate).format(
            "DD MMM",
          ) +
            " - " +
            moment(booking.actualEndDate ?? booking.endDate).format("DD MMM")}
        </RyogoCaption>
      </BookingCardHeaderWrapper>
      <BookingCardRouteWrapper
        source={booking.source.city}
        destination={booking.destination.city}
        type={booking.type}
      />
      <BookingCardAssignedWrapper
        assignedDriver={booking.assignedDriver}
        assignedVehicle={booking.assignedVehicle}
      />
      <BookingCardBottomWrapper>
        <BookingCardTagWrapper className="w-full">
          <RyogoIcon size="xs" icon={CheckCheck} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.completedAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
      </BookingCardBottomWrapper>
    </BookingCardWrapper>
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
    <BookingCardWrapper
      isRider={rider}
      bookingId={booking.id}
      className={`${rider ? "" : ""}`}
    >
      <BookingCardHeaderWrapper bookingId={booking.id}>
        <RyogoCaption color={booking.endDate < new Date() ? "red" : "light"}>
          {moment(booking.startDate).format("DD MMM") +
            " - " +
            moment(booking.endDate).format("DD MMM")}
        </RyogoCaption>
      </BookingCardHeaderWrapper>
      <BookingCardRouteWrapper
        source={booking.source.city}
        destination={booking.destination.city}
        type={booking.type}
      />
      <BookingCardAssignedWrapper
        assignedDriver={booking.assignedDriver}
        assignedVehicle={booking.assignedVehicle}
      />
      <BookingCardBottomWrapper>
        {booking.tripLogs[0] && (
          <TripLogStatusPill
            status={booking.tripLogs[0].type}
            className="w-full"
          />
        )}
      </BookingCardBottomWrapper>
      {rider && (
        <BookingCardStartWrapper>
          <RyogoCaption color="white" weight="font-bold">
            {startLabel}
          </RyogoCaption>
          <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
        </BookingCardStartWrapper>
      )}
    </BookingCardWrapper>
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
    <BookingCardWrapper
      isRider={rider}
      bookingId={booking.id}
      className={`${canStart && rider ? "" : ""}`}
    >
      <BookingCardHeaderWrapper bookingId={booking.id}>
        <RyogoCaption color={booking.startDate < new Date() ? "red" : "light"}>
          {moment(booking.startDate).format("DD MMM") +
            " - " +
            moment(booking.endDate).format("DD MMM")}
        </RyogoCaption>
      </BookingCardHeaderWrapper>
      <BookingCardRouteWrapper
        source={booking.source.city}
        destination={booking.destination.city}
        type={booking.type}
      />
      <BookingCardAssignedWrapper
        assignedDriver={booking.assignedDriver}
        assignedVehicle={booking.assignedVehicle}
      />
      <BookingCardBottomWrapper>
        {booking.pickupAddress && (
          <BookingCardTagWrapper className="justify-start">
            <RyogoIcon size="xs" icon={MapPin} color="light" />
            <RyogoTiny color="light">{booking.pickupAddress}</RyogoTiny>
          </BookingCardTagWrapper>
        )}
        {booking.startTime && (
          <BookingCardTagWrapper className="justify-end">
            <RyogoTiny color="light">
              {moment(combinedDateTime).format("LT")}
            </RyogoTiny>
            <RyogoIcon size="xs" icon={Clock} color="light" />
          </BookingCardTagWrapper>
        )}
      </BookingCardBottomWrapper>
      {rider && canStart && (
        <BookingCardStartWrapper>
          <RyogoCaption color="white" weight="font-bold">
            {startLabel}
          </RyogoCaption>
          <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
        </BookingCardStartWrapper>
      )}
    </BookingCardWrapper>
  )
}

export function CancelledBookingCard({
  booking,
}: {
  booking: FindCancelledBookingsPreviousDaysType[number]
}) {
  return (
    <BookingCardWrapper bookingId={booking.id}>
      <BookingCardHeaderWrapper bookingId={booking.id}>
        <RyogoCaption color={"light"}>
          {moment(booking.startDate).format("DD MMM") +
            " - " +
            moment(booking.endDate).format("DD MMM")}
        </RyogoCaption>
      </BookingCardHeaderWrapper>
      <BookingCardRouteWrapper
        source={booking.source.city}
        destination={booking.destination.city}
        type={booking.type}
      />
      <BookingCardAssignedWrapper
        assignedDriver={booking.assignedDriver}
        assignedVehicle={booking.assignedVehicle}
      />
      <BookingCardBottomWrapper>
        <BookingCardTagWrapper className="w-full">
          <RyogoIcon size="xs" icon={BookX} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.cancelledAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
      </BookingCardBottomWrapper>
    </BookingCardWrapper>
  )
}

export function LeadBookingCard({
  booking,
}: {
  booking: FindLeadBookingsType[number]
}) {
  return (
    <BookingCardWrapper bookingId={booking.id}>
      <BookingCardHeaderWrapper bookingId={booking.id}>
        <RyogoCaption color={booking.startDate < new Date() ? "red" : "light"}>
          {moment(booking.startDate).format("DD MMM") +
            " - " +
            moment(booking.endDate).format("DD MMM")}
        </RyogoCaption>
      </BookingCardHeaderWrapper>
      <BookingCardRouteWrapper
        source={booking.source.city}
        destination={booking.destination.city}
        type={booking.type}
      />
      <BookingCardAssignedWrapper
        assignedDriver={booking.assignedDriver}
        assignedVehicle={booking.assignedVehicle}
      />
      <BookingCardBottomWrapper>
        <BookingCardTagWrapper className="justify-start">
          <RyogoIcon size="xs" icon={ClockPlus} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.createdAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
        <RyogoSmall color="slate">
          {"₹" + booking.estimatedTotalAmount}
        </RyogoSmall>
      </BookingCardBottomWrapper>
    </BookingCardWrapper>
  )
}
