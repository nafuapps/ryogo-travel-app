import { SectionColWrapper } from "@/components/page/pageWrappers"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"

import Link from "next/link"

export default function DashboardOngoingTripComponent(
  props: NonNullable<FindOngoingTripsType>[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className="flex flex-row gap-3 hover:bg-slate-100 lg:gap-4 w-full justify-between border border-slate-100 rounded-lg p-4 lg:p-5">
        <SectionColWrapper justifyBetween>
          <SectionColWrapper small>
            <RyogoCaption color="dark" weight="font-bold">
              {props.type.toUpperCase()}
            </RyogoCaption>
            <RyogoH3>{props.route.toUpperCase()}</RyogoH3>
          </SectionColWrapper>
          <SectionColWrapper small>
            <RyogoSmall>{props.vehicle}</RyogoSmall>
            <RyogoCaption color="dark" weight="font-bold">
              {props.driver}
            </RyogoCaption>
          </SectionColWrapper>
        </SectionColWrapper>
        <SectionColWrapper end justifyBetween>
          <SectionColWrapper small end>
            <RyogoSmall>{props.customerName}</RyogoSmall>
            <RyogoCaption color="dark" weight="font-bold">
              {props.bookingId}
            </RyogoCaption>
          </SectionColWrapper>
          {props.status && <TripLogStatusPill status={props.status} />}
        </SectionColWrapper>
      </div>
    </Link>
  )
}
