import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import { CaptionBold, H4, Small } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"

import Link from "next/link"

export default function DashboardOngoingTripComponent(
  props: NonNullable<FindOngoingTripsType>[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className="flex flex-row gap-3 hover:bg-slate-100 lg:gap-4 w-full justify-between border-2 border-slate-100 rounded-lg p-4 lg:p-5">
        <div className="flex flex-col justify-start gap-4 lg:gap-5 items-start">
          <div className="flex flex-col gap-1 item-start">
            <CaptionBold>{props.type.toUpperCase()}</CaptionBold>
            <H4>{props.route.toUpperCase()}</H4>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <Small>{props.vehicle}</Small>
            <CaptionBold>{props.driver}</CaptionBold>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:gap-4 items-end">
          <div className="flex flex-col gap-1 items-end">
            <Small>{props.customerName}</Small>
            <CaptionBold>{props.bookingId}</CaptionBold>
          </div>
          {props.status && <TripLogStatusPill status={props.status} />}
        </div>
      </div>
    </Link>
  )
}
