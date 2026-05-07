import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"

import Link from "next/link"

export default function DashboardOngoingTripComponent(
  props: NonNullable<FindOngoingTripsType>[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className="flex flex-row gap-3 hover:bg-slate-100 lg:gap-4 w-full justify-between border-2 border-slate-100 rounded-lg p-4 lg:p-5">
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-1 item-start">
            <RyogoCaption color="dark" weight="font-bold">
              {props.type.toUpperCase()}
            </RyogoCaption>
            <RyogoH3>{props.route.toUpperCase()}</RyogoH3>
          </div>
          <div className="flex flex-col gap-1">
            <RyogoSmall>{props.vehicle}</RyogoSmall>
            <RyogoCaption color="dark" weight="font-bold">
              {props.driver}
            </RyogoCaption>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:gap-4 items-end">
          <div className="flex flex-col gap-1 items-end">
            <RyogoSmall>{props.customerName}</RyogoSmall>
            <RyogoCaption color="dark" weight="font-bold">
              {props.bookingId}
            </RyogoCaption>
          </div>
          {props.status && <TripLogStatusPill status={props.status} />}
        </div>
      </div>
    </Link>
  )
}
