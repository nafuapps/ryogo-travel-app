import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import { RyogoH4, RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindBookingScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function BookingSchedulePopoverCard(
  booking: FindBookingScheduleNextDaysType[number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Booking")
  const isDelayed =
    (booking.status === BookingStatusEnum.CONFIRMED &&
      booking.startDate < new Date()) ||
    (booking.status === BookingStatusEnum.IN_PROGRESS &&
      booking.endDate < new Date())
  return (
    <SectionColWrapper>
      <BookingStatusPill status={booking.status} />
      <SectionRowWrapper>
        <SectionColWrapper small>
          <RyogoCaption weight="font-bold">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>{booking.route}</RyogoH4>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoCaption color={isDelayed ? "red" : "slate"}>
            {moment(booking.startDate).format("DD MMM") +
              " - " +
              moment(booking.endDate).format("DD MMM")}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <SectionRowWrapper end>
        <SectionColWrapper small>
          <RyogoSmall>{booking.customerName}</RyogoSmall>
          <RyogoCaption weight="font-bold">{booking.bookingId}</RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper small end>
          {booking.vehicle ? (
            <RyogoSmall>{booking.vehicle}</RyogoSmall>
          ) : (
            <RyogoSmall color="red">{t("NotAssigned")}</RyogoSmall>
          )}
          {booking.driver ? (
            <RyogoCaption weight="font-bold">{booking.driver}</RyogoCaption>
          ) : (
            <RyogoCaption color="red">{t("NotAssigned")}</RyogoCaption>
          )}
        </SectionColWrapper>
      </SectionRowWrapper>
      {(!booking.driver || !booking.vehicle) && (
        <Link
          href={`/dashboard/bookings/${booking.bookingId}/${
            booking.vehicle ? "assign-driver" : "assign-vehicle"
          }`}
        >
          <RyogoDefaultButton label={t("Assign")} className="w-full" />
        </Link>
      )}
      <Link href={`/dashboard/bookings/${booking.bookingId}`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}

export function AssignedBookingPopoverCard(
  booking:
    | FindDriversScheduleNextDaysType[number]["assignedBookings"][number]
    | FindVehiclesScheduleNextDaysType[number]["assignedBookings"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.AssignedBooking")
  const isDelayed =
    (booking.status === BookingStatusEnum.CONFIRMED &&
      booking.startDate < new Date()) ||
    (booking.status === BookingStatusEnum.IN_PROGRESS &&
      booking.endDate < new Date())
  return (
    <SectionColWrapper>
      <SectionRowWrapper>
        <SectionColWrapper small>
          <RyogoCaption weight="font-bold">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>
            {booking.source.city + " - " + booking.destination.city}
          </RyogoH4>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoCaption color={isDelayed ? "red" : "slate"}>
            {moment(booking.startDate).format("DD MMM") +
              " - " +
              moment(booking.endDate).format("DD MMM")}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <SectionRowWrapper end>
        <SectionColWrapper small>
          <RyogoSmall>{booking.customer.name}</RyogoSmall>
          <RyogoCaption weight="font-bold">{booking.id}</RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoSmall>{booking.assignedVehicle?.vehicleNumber}</RyogoSmall>
          <RyogoCaption weight="font-bold">
            {booking.assignedDriver?.name}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <Link href={`/dashboard/bookings/${booking.id}`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}

export function RepairPopoverCard(
  repair: FindVehiclesScheduleNextDaysType[number]["vehicleRepairs"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Repair")
  const isDelayed = repair.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">
          {repair.vehicle.vehicleNumber}
        </RyogoCaption>
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{repair.addedByUser.name}</RyogoSmall>
        <RyogoCaption weight="font-bold">{repair.id}</RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/vehicles/${repair.vehicleId}/repairs`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}

export function LeavePopoverCard(
  leave: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Leave")
  const isDelayed = leave.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">{leave.driver.name}</RyogoCaption>
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(leave.startDate).format("DD MMM") +
            " - " +
            moment(leave.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{leave.addedByUser.name}</RyogoSmall>
        <RyogoCaption weight="font-bold">{leave.id}</RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/drivers/${leave.driverId}/leaves`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}
