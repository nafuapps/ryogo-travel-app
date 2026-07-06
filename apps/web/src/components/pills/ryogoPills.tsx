import {
  AgencyStatusEnum,
  BookingStatusEnum,
  CustomerStatusEnum,
  DriverStatusEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

type RyogoPillColor = "slate" | "brand" | "green" | "red" | "yellow" | "light"

function getStatusPillColor(color?: RyogoPillColor) {
  if (color === "slate") return "bg-slate-700"
  if (color === "light") return "bg-slate-400"
  if (color === "brand") return "bg-sky-700"
  if (color === "green") return "bg-green-600"
  if (color === "red") return "bg-red-600"
  if (color === "yellow") return "bg-yellow-600"
  return "bg-slate-700"
}

export function RyogoPill(props: {
  label: string
  bgColor: RyogoPillColor
  selfStart?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex rounded-full ${getStatusPillColor(props.bgColor)} px-2 py-1 lg:px-3 lg:py-1.5 shrink-0 text-nowrap ${props.selfStart ? "self-start" : ""} ${props.className ?? ""}`}
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
    return (
      <RyogoPill
        label={props.status.toUpperCase()}
        bgColor={"green"}
        selfStart
      />
    )
  }
  if (props.status === OrderStatusEnum.ATTEMPTED) {
    return (
      <RyogoPill
        label={props.status.toUpperCase()}
        bgColor={"brand"}
        selfStart
      />
    )
  }

  return (
    <RyogoPill
      label={props.status.toUpperCase()}
      bgColor={"yellow"}
      selfStart
    />
  )
}

export function PaymentStatusPill(props: { status: PaymentStatusEnum }) {
  if (props.status === PaymentStatusEnum.CAPTURED) {
    return (
      <RyogoPill
        label={props.status.toUpperCase()}
        bgColor={"green"}
        selfStart
      />
    )
  }
  if (props.status === PaymentStatusEnum.AUTHORIZED) {
    return (
      <RyogoPill
        label={props.status.toUpperCase()}
        bgColor={"brand"}
        selfStart
      />
    )
  }
  if (props.status === PaymentStatusEnum.FAILED) {
    return (
      <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} selfStart />
    )
  }

  return (
    <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} selfStart />
  )
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
