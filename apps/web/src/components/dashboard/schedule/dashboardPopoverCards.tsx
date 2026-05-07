import { RyogoH4, RyogoSmall, RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function OngoingBookingPopoverCard(
  props: FindScheduleNextDaysType[number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Booking")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4">
        <div className="flex flex-col gap-1 item-start">
          <RyogoCaption color="dark" weight="font-bold">
            {props.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>{props.route}</RyogoH4>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <RyogoCaption color="slate">
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </RyogoCaption>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1">
          <RyogoSmall>{props.customerName}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.bookingId}
          </RyogoCaption>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {props.vehicle ? (
            <RyogoSmall>{props.vehicle}</RyogoSmall>
          ) : (
            <RyogoSmall color="red">{t("NotAssigned")}</RyogoSmall>
          )}
          {props.driver ? (
            <RyogoCaption color="dark" weight="font-bold">
              {props.driver}
            </RyogoCaption>
          ) : (
            <RyogoCaption color="red">{t("NotAssigned")}</RyogoCaption>
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
      <div className="flex flex-row justify-between gap-3 lg:gap-4">
        <div className="flex flex-col gap-1 item-start">
          <RyogoCaption color="dark" weight="font-bold">
            {props.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>
            {props.source.city + " - " + props.destination.city}
          </RyogoH4>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <RyogoCaption color="slate">
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </RyogoCaption>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1">
          <RyogoSmall>{props.customer.name}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.id}
          </RyogoCaption>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <RyogoSmall>{props.assignedVehicle?.vehicleNumber}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.assignedDriver?.name}
          </RyogoCaption>
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
      <div className="flex flex-col gap-1">
        <RyogoCaption color="slate">{props.vehicle.vehicleNumber}</RyogoCaption>
        <RyogoH4>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </RyogoH4>
      </div>
      <div className="flex flex-col gap-1">
        <RyogoSmall>{props.addedByUser.name}</RyogoSmall>
        <RyogoCaption color="dark" weight="font-bold">
          {props.id}
        </RyogoCaption>
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
      <div className="flex flex-col gap-1">
        <RyogoCaption color="slate">{props.driver.name}</RyogoCaption>
        <RyogoH4>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </RyogoH4>
      </div>
      <div className="flex flex-col gap-1">
        <RyogoSmall>{props.addedByUser.name}</RyogoSmall>
        <RyogoCaption color="dark" weight="font-bold">
          {props.id}
        </RyogoCaption>
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
