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
import { RyogoCaption, RyogoTiny } from "@/components/typography"

type RyogoPillColorType =
  | "slate"
  | "brand"
  | "green"
  | "red"
  | "yellow"
  | "light"

function getPillColor(color: RyogoPillColorType = "slate") {
  switch (color) {
    case "light":
      return "bg-slate-500 dark:bg-slate-500"
    case "brand":
      return "bg-sky-700 dark:bg-sky-300"
    case "green":
      return "bg-green-700 dark:bg-green-300"
    case "red":
      return "bg-red-700 dark:bg-red-300"
    case "yellow":
      return "bg-yellow-700 dark:bg-yellow-300"
    case "slate":
      return "bg-slate-700 dark:bg-slate-300"
  }
}

type RyogoPillSizeType = "lg" | "md" | "sm"

function getPillSize(size: RyogoPillSizeType = "md") {
  switch (size) {
    case "lg":
      return "px-3 py-1.5 lg:px-4 lg:py-2"
    case "md":
      return "px-2.5 py-1 lg:px-3 lg:py-1.25"
    case "sm":
      return "px-2 py-0.75 lg:px-2.5 lg:py-1"
  }
}

type PillType = {
  label: string
  bgColor: RyogoPillColorType
  size?: RyogoPillSizeType
  className?: string
}

export function RyogoPill(props: PillType) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${getPillColor(props.bgColor)} ${getPillSize(props.size)} shrink-0 text-nowrap ${props.className ?? ""}`}
    >
      {props.size === "sm" ? (
        <RyogoTiny color="white">{props.label}</RyogoTiny>
      ) : (
        <RyogoCaption color="white">{props.label}</RyogoCaption>
      )}
    </div>
  )
}

type RyogoPillType = Omit<PillType, "label" | "bgColor">

export function BookingStatusPill(
  props: { status: BookingStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case BookingStatusEnum.IN_PROGRESS:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case BookingStatusEnum.COMPLETED:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case BookingStatusEnum.CANCELLED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case BookingStatusEnum.LEAD:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case BookingStatusEnum.CONFIRMED:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function VehicleStatusPill(
  props: { status: VehicleStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case VehicleStatusEnum.AVAILABLE:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case VehicleStatusEnum.REPAIR:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case VehicleStatusEnum.ON_TRIP:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case VehicleStatusEnum.SUSPENDED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case VehicleStatusEnum.INACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function DriverStatusPill(
  props: { status: DriverStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case DriverStatusEnum.AVAILABLE:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case DriverStatusEnum.LEAVE:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case DriverStatusEnum.ON_TRIP:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case DriverStatusEnum.SUSPENDED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case DriverStatusEnum.INACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function AgencyStatusPill(
  props: { status: AgencyStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case AgencyStatusEnum.ACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case AgencyStatusEnum.INACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case AgencyStatusEnum.SUSPENDED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case AgencyStatusEnum.NEW:
    default:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function UserStatusPill(
  props: { status: UserStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case UserStatusEnum.ACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case UserStatusEnum.INACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case UserStatusEnum.SUSPENDED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case UserStatusEnum.NEW:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function CustomerStatusPill(
  props: { status: CustomerStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case CustomerStatusEnum.ACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case CustomerStatusEnum.INACTIVE:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case CustomerStatusEnum.SUSPENDED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
  }
}

export function OrderStatusPill(
  props: { status: OrderStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case OrderStatusEnum.PAID:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case OrderStatusEnum.ATTEMPTED:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case OrderStatusEnum.CREATED:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function PaymentStatusPill(
  props: { status: PaymentStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case PaymentStatusEnum.CAPTURED:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case PaymentStatusEnum.AUTHORIZED:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case PaymentStatusEnum.FAILED:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
    case PaymentStatusEnum.REFUNDED:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case PaymentStatusEnum.CREATED:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function TripLogStatusPill(
  props: { status: TripLogTypesEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case TripLogTypesEnum.ENDED:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case TripLogTypesEnum.DROPPED:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case TripLogTypesEnum.PICKED_UP:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case TripLogTypesEnum.ARRIVED:
      return <RyogoPill {...props} label={label} bgColor={"light"} />
    case TripLogTypesEnum.STARTED:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
    case TripLogTypesEnum.OTHER:
      return <RyogoPill {...props} label={label} bgColor={"red"} />
  }
}

export function LeaveStatusPill(
  props: { status: string; completed: boolean } & RyogoPillType,
) {
  return (
    <RyogoPill
      label={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}

export function RepairStatusPill(
  props: {
    status: string
    completed: boolean
  } & RyogoPillType,
) {
  return (
    <RyogoPill
      label={props.status}
      bgColor={props.completed ? "green" : "yellow"}
    />
  )
}

export function SupportTicketStatusPill(
  props: { status: TicketStatusEnum } & RyogoPillType,
) {
  const label = props.status.toUpperCase()
  switch (props.status) {
    case TicketStatusEnum.CLOSED:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
    case TicketStatusEnum.RESOLVED:
      return <RyogoPill {...props} label={label} bgColor={"green"} />
    case TicketStatusEnum.IN_PROGRESS:
      return <RyogoPill {...props} label={label} bgColor={"yellow"} />
    case TicketStatusEnum.OPEN:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
  }
}

export function SubscriptionPlanPill(
  props: { plan: SubscriptionPlanEnum } & RyogoPillType,
) {
  const label = props.plan.toUpperCase()
  switch (props.plan) {
    case SubscriptionPlanEnum.BASIC:
      return <RyogoPill {...props} label={label} bgColor={"slate"} />
    case SubscriptionPlanEnum.PREMIUM:
      return <RyogoPill {...props} label={label} bgColor={"brand"} />
  }
}
