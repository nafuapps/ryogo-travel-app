import {
  AgencyStatusEnum,
  BookingStatusEnum,
  CustomerStatusEnum,
  DriverStatusEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
  TicketStatusEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

type RyogoPillColor = "slate" | "brand" | "green" | "red" | "yellow" | "light"

function getPillColor(color?: RyogoPillColor) {
  switch (color) {
    case undefined:
    case "slate":
      return "bg-slate-700 dark:bg-slate-200"
    case "light":
      return "bg-slate-400 dark:bg-slate-500"
    case "brand":
      return "bg-sky-700 dark:bg-sky-200"
    case "green":
      return "bg-green-700 dark:bg-green-200"
    case "red":
      return "bg-red-700 dark:bg-red-200"
    case "yellow":
      return "bg-yellow-700 dark:bg-yellow-200"
  }
}

export function RyogoPill(props: {
  label: string
  bgColor: RyogoPillColor
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${getPillColor(props.bgColor)} px-2 py-1 lg:px-3 lg:py-1.5 shrink-0 text-nowrap ${props.className ?? ""}`}
    >
      <RyogoCaption color="white">{props.label}</RyogoCaption>
    </div>
  )
}

export function BookingStatusPill(props: { status: BookingStatusEnum }) {
  if (props.status === BookingStatusEnum.IN_PROGRESS) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === BookingStatusEnum.COMPLETED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === BookingStatusEnum.CANCELLED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === BookingStatusEnum.CONFIRMED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function VehicleStatusPill(props: { status: VehicleStatusEnum }) {
  if (props.status === VehicleStatusEnum.ON_TRIP) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === VehicleStatusEnum.AVAILABLE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === VehicleStatusEnum.INACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === VehicleStatusEnum.REPAIR) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function DriverStatusPill(props: { status: DriverStatusEnum }) {
  if (props.status === DriverStatusEnum.ON_TRIP) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === DriverStatusEnum.AVAILABLE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === DriverStatusEnum.INACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === DriverStatusEnum.LEAVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function AgencyStatusPill(props: { status: AgencyStatusEnum }) {
  if (props.status === AgencyStatusEnum.NEW) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === AgencyStatusEnum.ACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === AgencyStatusEnum.EXPIRED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function UserStatusPill(props: { status: UserStatusEnum }) {
  if (props.status === UserStatusEnum.NEW) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === UserStatusEnum.ACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === UserStatusEnum.INACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function CustomerStatusPill(props: { status: CustomerStatusEnum }) {
  if (props.status === CustomerStatusEnum.ACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === CustomerStatusEnum.INACTIVE) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }

  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function OrderStatusPill(props: { status: OrderStatusEnum }) {
  if (props.status === OrderStatusEnum.PAID) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === OrderStatusEnum.ATTEMPTED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }

  return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
}

export function PaymentStatusPill(props: { status: PaymentStatusEnum }) {
  if (props.status === PaymentStatusEnum.CAPTURED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === PaymentStatusEnum.AUTHORIZED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === PaymentStatusEnum.FAILED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }

  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function TripLogStatusPill(props: { status: TripLogTypesEnum }) {
  if (props.status === TripLogTypesEnum.START_TRIP) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  if (props.status === TripLogTypesEnum.END_TRIP) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (
    [
      TripLogTypesEnum.DROP,
      TripLogTypesEnum.ARRIVED,
      TripLogTypesEnum.PICKUP,
    ].includes(props.status)
  ) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}

export function LeaveStatusPill(props: { status: string; completed: boolean }) {
  return (
    <RyogoPill
      label={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}

export function RepairStatusPill(props: {
  status: string
  completed: boolean
}) {
  return (
    <RyogoPill
      label={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}

export function SupportTicketStatusPill(props: { status: TicketStatusEnum }) {
  if (props.status === TicketStatusEnum.IN_PROGRESS) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  if (props.status === TicketStatusEnum.RESOLVED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === TicketStatusEnum.CLOSED) {
    return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
  }

  return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
}
