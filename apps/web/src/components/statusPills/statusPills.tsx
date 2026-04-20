import {
  AgencyStatusEnum,
  BookingStatusEnum,
  CustomerStatusEnum,
  DriverStatusEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { CaptionBold } from "../typography"

interface StatusPillProps {
  status: string
  bgColor: string
}
export function StatusPill(props: StatusPillProps) {
  return (
    <div
      className={`flex rounded-full ${props.bgColor ?? "bg-slate-200"} px-2 py-1.5 lg:px-3 lg:py-2 text-nowrap`}
    >
      <CaptionBold>{props.status}</CaptionBold>
    </div>
  )
}

interface BookingStatusPillProps {
  status: BookingStatusEnum
}
export function BookingStatusPill(props: BookingStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === BookingStatusEnum.IN_PROGRESS) {
    bgColor = "bg-sky-200"
  }
  if (props.status === BookingStatusEnum.COMPLETED) {
    bgColor = "bg-green-200"
  }
  if (props.status === BookingStatusEnum.CANCELLED) {
    bgColor = "bg-red-200"
  }
  if (props.status === BookingStatusEnum.CONFIRMED) {
    bgColor = "bg-yellow-200"
  }
  if (props.status === BookingStatusEnum.LEAD) {
    bgColor = "bg-slate-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface VehicleStatusPillProps {
  status: VehicleStatusEnum
}
export function VehicleStatusPill(props: VehicleStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === VehicleStatusEnum.ON_TRIP) {
    bgColor = "bg-sky-200"
  }
  if (props.status === VehicleStatusEnum.AVAILABLE) {
    bgColor = "bg-green-200"
  }
  if (props.status === VehicleStatusEnum.INACTIVE) {
    bgColor = "bg-red-200"
  }
  if (props.status === VehicleStatusEnum.REPAIR) {
    bgColor = "bg-yellow-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface DriverStatusPillProps {
  status: DriverStatusEnum
}
export function DriverStatusPill(props: DriverStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === DriverStatusEnum.ON_TRIP) {
    bgColor = "bg-sky-200"
  }
  if (props.status === DriverStatusEnum.AVAILABLE) {
    bgColor = "bg-green-200"
  }
  if (props.status === DriverStatusEnum.INACTIVE) {
    bgColor = "bg-red-200"
  }
  if (props.status === DriverStatusEnum.LEAVE) {
    bgColor = "bg-yellow-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface AgencyStatusPillProps {
  status: AgencyStatusEnum
}
export function AgencyStatusPill(props: AgencyStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === AgencyStatusEnum.NEW) {
    bgColor = "bg-sky-200"
  }
  if (props.status === AgencyStatusEnum.ACTIVE) {
    bgColor = "bg-green-200"
  }
  if (props.status === AgencyStatusEnum.EXPIRED) {
    bgColor = "bg-red-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface UserStatusPillProps {
  status: UserStatusEnum
}
export function UserStatusPill(props: UserStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === UserStatusEnum.NEW) {
    bgColor = "bg-sky-200"
  }
  if (props.status === UserStatusEnum.ACTIVE) {
    bgColor = "bg-green-200"
  }
  if (props.status === UserStatusEnum.INACTIVE) {
    bgColor = "bg-red-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface CustomerStatusPillProps {
  status: CustomerStatusEnum
}
export function CustomerStatusPill(props: CustomerStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === CustomerStatusEnum.ACTIVE) {
    bgColor = "bg-green-200"
  }
  if (props.status === CustomerStatusEnum.INACTIVE) {
    bgColor = "bg-red-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}

interface TripLogStatusPillProps {
  status: TripLogTypesEnum
}
export function TripLogStatusPill(props: TripLogStatusPillProps) {
  let bgColor = "bg-slate-200"
  if (props.status === TripLogTypesEnum.START_TRIP) {
    bgColor = "bg-yellow-200"
  }
  if (props.status === TripLogTypesEnum.END_TRIP) {
    bgColor = "bg-green-200"
  }
  if (
    [
      TripLogTypesEnum.DROP,
      TripLogTypesEnum.ARRIVED,
      TripLogTypesEnum.PICKUP,
    ].includes(props.status)
  ) {
    bgColor = "bg-sky-200"
  }

  return <StatusPill status={props.status.toUpperCase()} bgColor={bgColor} />
}
