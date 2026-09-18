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
  FindDriversScheduleNextDaysType,
} from "@ryogo-travel-app/api/services/driver.services"
import {
  FindVehicleAssignedBookingsByIdType,
  FindVehicleCompletedBookingsByIdType,
  FindVehiclesScheduleNextDaysType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import {
  FindUserAssignedBookingsByIdType,
  FindUserCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/user.services"
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import { getCombinedDateTime } from "@/lib/utils"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  Ban,
  Car,
  CheckCheck,
  ChevronRight,
  Clock,
  ClockPlus,
  IdCard,
  MapPin,
} from "lucide-react"
import {
  FindBookingHistoryLastDaysType,
  FindBookingScheduleNextDaysType,
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
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { useTranslations } from "next-intl"

function BookingCardWrapper({
  bookingId,
  isRider,
  cta,
  children,
  className,
}: {
  bookingId: string
  isRider?: boolean
  cta?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const t = useTranslations("BookingCards")
  return (
    <SectionColWrapper
      className={`rounded-sm overflow-hidden bg-white dark:bg-slate-900 border ${className ?? ""}`}
    >
      {children}
      <div className="px-3 lg:px-4 pb-2 lg:pb-3">
        <Link
          href={
            isRider
              ? `/rider/myBookings/${bookingId}`
              : `/dashboard/bookings/${bookingId}`
          }
        >
          {cta ?? (
            <RyogoOutlineButton
              label={t("ViewDetails")}
              labelColor="light"
              className="w-full"
            >
              <RyogoIcon icon={ChevronRight} size="xs" thick color="light" />
            </RyogoOutlineButton>
          )}
        </Link>
      </div>
    </SectionColWrapper>
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

function BookingCardLineWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SectionRowWrapper className="items-center justify-between px-3 lg:px-4">
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
    <SectionRowWrapper className="items-center justify-between px-3 lg:px-4">
      <RyogoH4 weight="font-bold">{source}</RyogoH4>
      <GetTripTypeIcon tripType={type} size="xs" color="slate" thick />
      <RyogoH4 weight="font-bold">{destination}</RyogoH4>
    </SectionRowWrapper>
  )
}

function BookingCardAssignedWrapper({
  assignedVehicle,
  assignedDriver,
  showReminder,
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
  showReminder?: boolean
}) {
  return (
    <SectionRowWrapper className="items-center justify-between px-3 lg:px-4">
      {assignedVehicle ? (
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
      ) : showReminder ? (
        <RyogoEnclosedIcon icon={Car} size="sm" color="red" bgColor="red" />
      ) : null}
      {assignedDriver ? (
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
      ) : showReminder ? (
        <RyogoEnclosedIcon icon={IdCard} size="sm" color="red" bgColor="red" />
      ) : null}
    </SectionRowWrapper>
  )
}

function BookingStartButton({ label }: { label: string }) {
  return (
    <RyogoDefaultButton label={label} className="w-full">
      <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
    </RyogoDefaultButton>
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
    | FindBookingHistoryLastDaysType[number]
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
      <BookingCardLineWrapper>
        <BookingCardTagWrapper className="w-full">
          <RyogoIcon size="xs" icon={CheckCheck} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.completedAt ?? booking.updatedAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
      </BookingCardLineWrapper>
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
    | FindBookingScheduleNextDaysType[number]
    | FindBookingHistoryLastDaysType[number]
    | FindDriversScheduleNextDaysType[number]["assignedBookings"][number]
    | FindVehiclesScheduleNextDaysType[number]["assignedBookings"][number]
  rider?: boolean
  startLabel?: string
}) {
  return (
    <BookingCardWrapper
      isRider={rider}
      bookingId={booking.id}
      className={`${rider ? "" : ""}`}
      cta={rider && startLabel && <BookingStartButton label={startLabel} />}
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
      <BookingCardLineWrapper>
        {booking.tripLogs[0] && (
          <TripLogStatusPill
            status={booking.tripLogs[0].type}
            className="w-full"
          />
        )}
      </BookingCardLineWrapper>
    </BookingCardWrapper>
  )
}

export function UpcomingBookingCard({
  booking,
  canAssign,
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
    | FindBookingScheduleNextDaysType[number]
    | FindDriversScheduleNextDaysType[number]["assignedBookings"][number]
    | FindVehiclesScheduleNextDaysType[number]["assignedBookings"][number]

  canAssign?: boolean
  rider?: boolean
  canStart?: boolean
  startLabel?: string
}) {
  const t = useTranslations("BookingCards")
  const combinedDateTime = getCombinedDateTime(
    booking.startDate,
    booking.startTime,
  )

  return (
    <BookingCardWrapper
      isRider={rider}
      bookingId={booking.id}
      className={`${canStart && rider ? "" : ""}`}
      cta={
        rider &&
        canStart &&
        startLabel && <BookingStartButton label={startLabel} />
      }
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
        showReminder
      />
      <BookingCardLineWrapper>
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
      </BookingCardLineWrapper>
      {canAssign && (!booking.assignedDriver || !booking.assignedVehicle) && (
        <BookingCardLineWrapper>
          <RyogoDefaultButton
            label={
              booking.assignedVehicle ? t("AssignDriver") : t("AssignVehicle")
            }
            className="w-full"
          />
        </BookingCardLineWrapper>
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
      <BookingCardLineWrapper>
        <BookingCardTagWrapper className="w-full">
          <RyogoIcon size="xs" icon={Ban} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.cancelledAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
      </BookingCardLineWrapper>
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
        showReminder={booking.startDate < new Date()}
      />
      <BookingCardLineWrapper>
        <BookingCardTagWrapper className="justify-start">
          <RyogoIcon size="xs" icon={ClockPlus} color="light" thick />
          <RyogoTiny color="light">
            {moment(booking.createdAt).format("lll")}
          </RyogoTiny>
        </BookingCardTagWrapper>
        <RyogoSmall color="slate">
          {"₹" + booking.estimatedTotalAmount}
        </RyogoSmall>
      </BookingCardLineWrapper>
    </BookingCardWrapper>
  )
}
