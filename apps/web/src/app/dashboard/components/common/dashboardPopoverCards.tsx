import {
  CaptionBold,
  H5,
  Small,
  SmallRed,
  CaptionRed,
  Caption,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function BookingPopoverCard(props: FindScheduleNextDaysType[number]) {
  const t = useTranslations("Dashboard.PopoverCards.Booking")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-start">
        <div className="flex flex-col gap-1 item-start">
          <CaptionBold>{props.type.toUpperCase()}</CaptionBold>
          <H5>{props.route}</H5>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Caption>
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </Caption>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1 items-start">
          <Small>{props.customerName}</Small>
          <CaptionBold>{props.bookingId}</CaptionBold>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {props.vehicle ? (
            <Small>{props.vehicle}</Small>
          ) : (
            <SmallRed>{t("NotAssigned")}</SmallRed>
          )}
          {props.driver ? (
            <CaptionBold>{props.driver}</CaptionBold>
          ) : (
            <CaptionRed>{t("NotAssigned")}</CaptionRed>
          )}
        </div>
      </div>
      {(!props.driver || !props.vehicle) && (
        <Link
          href={`/dashboard/bookings/${props.bookingId}/${
            props.vehicle ? "assign-driver" : "assign-vehicle"
          }`}
        >
          <Button variant={"default"} type="button" className="w-full">
            {t("Assign")}
          </Button>
        </Link>
      )}
      <Link href={`/dashboard/bookings/${props.bookingId}`}>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full hover:cursor-pointer"
        >
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  )
}

export function AssignedBookingPopoverCard(
  props:
    | FindDriversScheduleNextDaysType[number]["assignedBookings"][number]
    | FindVehiclesScheduleNextDaysType[number]["assignedBookings"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.AssignedBooking")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-start">
        <div className="flex flex-col gap-1 item-start">
          <CaptionBold>{props.type.toUpperCase()}</CaptionBold>
          <H5>{props.source.city + " - " + props.destination.city}</H5>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Caption>
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </Caption>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1 items-start">
          <Small>{props.customer.name}</Small>
          <CaptionBold>{props.id}</CaptionBold>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Small>{props.assignedVehicle?.vehicleNumber}</Small>
          <CaptionBold>{props.assignedDriver?.name}</CaptionBold>
        </div>
      </div>
      <Link href={`/dashboard/bookings/${props.id}`}>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full hover:cursor-pointer"
        >
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  )
}

export function RepairPopoverCard(
  props: FindVehiclesScheduleNextDaysType[number]["vehicleRepairs"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Repair")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-1 items-start">
        <Caption>{props.vehicle.vehicleNumber}</Caption>
        <H5>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </H5>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <Small>{props.addedByUser.name}</Small>
        <CaptionBold>{props.id}</CaptionBold>
      </div>
      <Link href={`/dashboard/vehicles/${props.vehicleId}/repairs`}>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full hover:cursor-pointer"
        >
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  )
}

export function LeavePopoverCard(
  props: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Leave")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-1 items-start">
        <Caption>{props.driver.name}</Caption>
        <H5>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </H5>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <Small>{props.addedByUser.name}</Small>
        <CaptionBold>{props.id}</CaptionBold>
      </div>
      <Link href={`/dashboard/drivers/${props.driverId}/leaves`}>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full hover:cursor-pointer"
        >
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  )
}
