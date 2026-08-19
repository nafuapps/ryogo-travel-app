import {
  AgencyStatusEnum,
  BookingStatusEnum,
  CustomerStatusEnum,
  DriverStatusEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
  SubscriptionPlanEnum,
  TicketStatusEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

type RyogoPillColorType =
  | "slate"
  | "brand"
  | "green"
  | "red"
  | "yellow"
  | "light"

function getPillColor(color?: RyogoPillColorType) {
  switch (color) {
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
    case "slate":
    case undefined:
      return "bg-slate-700 dark:bg-slate-200"
  }
}

export function RyogoPill(props: {
  label: string
  bgColor: RyogoPillColorType
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
  switch (props.status) {
    case BookingStatusEnum.IN_PROGRESS:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case BookingStatusEnum.COMPLETED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case BookingStatusEnum.CANCELLED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case BookingStatusEnum.LEAD:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case BookingStatusEnum.CONFIRMED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function VehicleStatusPill(props: { status: VehicleStatusEnum }) {
  switch (props.status) {
    case VehicleStatusEnum.AVAILABLE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case VehicleStatusEnum.REPAIR:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case VehicleStatusEnum.ON_TRIP:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case VehicleStatusEnum.SUSPENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case VehicleStatusEnum.INACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function DriverStatusPill(props: { status: DriverStatusEnum }) {
  switch (props.status) {
    case DriverStatusEnum.AVAILABLE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case DriverStatusEnum.LEAVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case DriverStatusEnum.ON_TRIP:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case DriverStatusEnum.SUSPENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case DriverStatusEnum.INACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function AgencyStatusPill(props: { status: AgencyStatusEnum }) {
  switch (props.status) {
    case AgencyStatusEnum.ACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case AgencyStatusEnum.INACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case AgencyStatusEnum.SUSPENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case AgencyStatusEnum.NEW:
    default:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function UserStatusPill(props: { status: UserStatusEnum }) {
  switch (props.status) {
    case UserStatusEnum.ACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case UserStatusEnum.INACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case UserStatusEnum.SUSPENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case UserStatusEnum.NEW:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function CustomerStatusPill(props: { status: CustomerStatusEnum }) {
  switch (props.status) {
    case CustomerStatusEnum.ACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case CustomerStatusEnum.INACTIVE:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case CustomerStatusEnum.SUSPENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
  }
}

export function OrderStatusPill(props: { status: OrderStatusEnum }) {
  switch (props.status) {
    case OrderStatusEnum.PAID:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case OrderStatusEnum.ATTEMPTED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case OrderStatusEnum.CREATED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function PaymentStatusPill(props: { status: PaymentStatusEnum }) {
  switch (props.status) {
    case PaymentStatusEnum.CAPTURED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case PaymentStatusEnum.AUTHORIZED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case PaymentStatusEnum.FAILED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"red"} />
    case PaymentStatusEnum.REFUNDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case PaymentStatusEnum.CREATED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function TripLogStatusPill(props: { status: TripLogTypesEnum }) {
  switch (props.status) {
    case TripLogTypesEnum.ENDED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case TripLogTypesEnum.DROPPED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case TripLogTypesEnum.PICKED_UP:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case TripLogTypesEnum.ARRIVED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"light"} />
    case TripLogTypesEnum.STARTED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
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
  switch (props.status) {
    case TicketStatusEnum.CLOSED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"brand"} />
    case TicketStatusEnum.RESOLVED:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"green"} />
    case TicketStatusEnum.IN_PROGRESS:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"yellow"} />
    case TicketStatusEnum.OPEN:
      return <RyogoPill label={props.status.toUpperCase()} bgColor={"slate"} />
  }
}

export function SubscriptionPlanPill(props: { plan: SubscriptionPlanEnum }) {
  switch (props.plan) {
    case SubscriptionPlanEnum.BASIC:
      return <RyogoPill label={props.plan.toUpperCase()} bgColor={"slate"} />
    case SubscriptionPlanEnum.PREMIUM:
      return <RyogoPill label={props.plan.toUpperCase()} bgColor={"brand"} />
  }
}
