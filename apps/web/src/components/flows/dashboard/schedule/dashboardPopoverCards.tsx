import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
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
    <SectionColWrapper>
      <SectionRowWrapper>
        <SectionColWrapper small>
          <RyogoCaption color="dark" weight="font-bold">
            {props.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>{props.route}</RyogoH4>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoCaption color="slate">
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <SectionRowWrapper end>
        <SectionColWrapper small>
          <RyogoSmall>{props.customerName}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.bookingId}
          </RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper small end>
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
        </SectionColWrapper>
      </SectionRowWrapper>
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
        <Button variant={"secondary"} type="button" className="w-full">
          {t("ViewDetails")}
        </Button>
      </Link>
    </SectionColWrapper>
  )
}

export function AssignedBookingPopoverCard(
  props:
    | FindDriversScheduleNextDaysType[number]["assignedBookings"][number]
    | FindVehiclesScheduleNextDaysType[number]["assignedBookings"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.AssignedBooking")
  return (
    <SectionColWrapper>
      <SectionRowWrapper>
        <SectionColWrapper small>
          <RyogoCaption color="dark" weight="font-bold">
            {props.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>
            {props.source.city + " - " + props.destination.city}
          </RyogoH4>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoCaption color="slate">
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <SectionRowWrapper end>
        <SectionColWrapper small>
          <RyogoSmall>{props.customer.name}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.id}
          </RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper small end>
          <RyogoSmall>{props.assignedVehicle?.vehicleNumber}</RyogoSmall>
          <RyogoCaption color="dark" weight="font-bold">
            {props.assignedDriver?.name}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <Link href={`/dashboard/bookings/${props.id}`}>
        <Button variant={"secondary"} type="button" className="w-full">
          {t("ViewDetails")}
        </Button>
      </Link>
    </SectionColWrapper>
  )
}

export function RepairPopoverCard(
  props: FindVehiclesScheduleNextDaysType[number]["vehicleRepairs"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Repair")
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">{props.vehicle.vehicleNumber}</RyogoCaption>
        <RyogoH4>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{props.addedByUser.name}</RyogoSmall>
        <RyogoCaption color="dark" weight="font-bold">
          {props.id}
        </RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/vehicles/${props.vehicleId}/repairs`}>
        <Button variant={"secondary"} type="button" className="w-full">
          {t("ViewDetails")}
        </Button>
      </Link>
    </SectionColWrapper>
  )
}

export function LeavePopoverCard(
  props: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("Dashboard.PopoverCards.Leave")
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">{props.driver.name}</RyogoCaption>
        <RyogoH4>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{props.addedByUser.name}</RyogoSmall>
        <RyogoCaption color="dark" weight="font-bold">
          {props.id}
        </RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/drivers/${props.driverId}/leaves`}>
        <Button variant={"secondary"} type="button" className="w-full">
          {t("ViewDetails")}
        </Button>
      </Link>
    </SectionColWrapper>
  )
}
