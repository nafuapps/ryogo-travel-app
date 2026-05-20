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

type StatusPillColor = "slate" | "brand" | "green" | "red" | "yellow"

function getStatusPillColor(color?: StatusPillColor) {
  if (color === "slate") return "bg-slate-700"
  if (color === "brand") return "bg-sky-700"
  if (color === "green") return "bg-green-600"
  if (color === "red") return "bg-red-600"
  if (color === "yellow") return "bg-yellow-600"
  return "bg-slate-700"
}

interface StatusPillProps {
  status: string
  bgColor: StatusPillColor
}
export function StatusPill(props: StatusPillProps) {
  return (
    <div
      className={`flex rounded-full ${getStatusPillColor(props.bgColor)} px-2 py-1 lg:px-3 lg:py-1.5 shrink-0 text-nowrap`}
    >
      <RyogoCaption color="white">{props.status}</RyogoCaption>
    </div>
  )
}

interface BookingStatusPillProps {
  status: BookingStatusEnum
}
export function BookingStatusPill(props: BookingStatusPillProps) {
  if (props.status === BookingStatusEnum.IN_PROGRESS) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === BookingStatusEnum.COMPLETED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === BookingStatusEnum.CANCELLED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === BookingStatusEnum.CONFIRMED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface VehicleStatusPillProps {
  status: VehicleStatusEnum
}
export function VehicleStatusPill(props: VehicleStatusPillProps) {
  if (props.status === VehicleStatusEnum.ON_TRIP) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === VehicleStatusEnum.AVAILABLE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === VehicleStatusEnum.INACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === VehicleStatusEnum.REPAIR) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface DriverStatusPillProps {
  status: DriverStatusEnum
}
export function DriverStatusPill(props: DriverStatusPillProps) {
  if (props.status === DriverStatusEnum.ON_TRIP) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === DriverStatusEnum.AVAILABLE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === DriverStatusEnum.INACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }
  if (props.status === DriverStatusEnum.LEAVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface AgencyStatusPillProps {
  status: AgencyStatusEnum
}
export function AgencyStatusPill(props: AgencyStatusPillProps) {
  if (props.status === AgencyStatusEnum.NEW) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === AgencyStatusEnum.ACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === AgencyStatusEnum.EXPIRED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface UserStatusPillProps {
  status: UserStatusEnum
}
export function UserStatusPill(props: UserStatusPillProps) {
  if (props.status === UserStatusEnum.NEW) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === UserStatusEnum.ACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === UserStatusEnum.INACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface CustomerStatusPillProps {
  status: CustomerStatusEnum
}
export function CustomerStatusPill(props: CustomerStatusPillProps) {
  if (props.status === CustomerStatusEnum.ACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === CustomerStatusEnum.INACTIVE) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface OrderStatusPillProps {
  status: OrderStatusEnum
}
export function OrderStatusPill(props: OrderStatusPillProps) {
  if (props.status === OrderStatusEnum.PAID) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === OrderStatusEnum.ATTEMPTED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={"yellow"} />
}

interface PaymentStatusPillProps {
  status: PaymentStatusEnum
}
export function PaymentStatusPill(props: PaymentStatusPillProps) {
  if (props.status === PaymentStatusEnum.CAPTURED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (props.status === PaymentStatusEnum.AUTHORIZED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  if (props.status === PaymentStatusEnum.FAILED) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"red"} />
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface TripLogStatusPillProps {
  status: TripLogTypesEnum
}
export function TripLogStatusPill(props: TripLogStatusPillProps) {
  if (props.status === TripLogTypesEnum.START_TRIP) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"yellow"} />
  }
  if (props.status === TripLogTypesEnum.END_TRIP) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"green"} />
  }
  if (
    [
      TripLogTypesEnum.DROP,
      TripLogTypesEnum.ARRIVED,
      TripLogTypesEnum.PICKUP,
    ].includes(props.status)
  ) {
    return <StatusPill status={props.status.toUpperCase()} bgColor={"brand"} />
  }
  return <StatusPill status={props.status.toUpperCase()} bgColor={"slate"} />
}

interface LeaveStatusPillProps {
  status: string
  completed: boolean
}
export function LeaveStatusPill(props: LeaveStatusPillProps) {
  return (
    <StatusPill
      status={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}

interface RepairStatusPillProps {
  status: string
  completed: boolean
}
export function RepairStatusPill(props: RepairStatusPillProps) {
  return (
    <StatusPill
      status={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}
