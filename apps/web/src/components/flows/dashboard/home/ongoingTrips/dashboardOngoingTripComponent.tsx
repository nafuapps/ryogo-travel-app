import { SectionColWrapper } from "@/components/page/pageWrappers"
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"

import Link from "next/link"

export default function DashboardOngoingTripComponent({
  ongoingTrip,
  userId,
}: {
  ongoingTrip: NonNullable<FindOngoingTripsType>[number]
  userId: string
}) {
  const isAssigned = ongoingTrip.assignedUserId === userId

  return (
    <Link href={`/dashboard/bookings/${ongoingTrip.bookingId}`}>
      <div
        className={`flex flex-row gap-3 lg:gap-4 w-full justify-between border ${isAssigned ? "border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-800" : "border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-4 lg:p-5`}
      >
        <SectionColWrapper justifyBetween>
          <SectionColWrapper small>
            <RyogoCaption weight="font-bold">
              {ongoingTrip.type.toUpperCase()}
            </RyogoCaption>
            <RyogoH3>{ongoingTrip.route.toUpperCase()}</RyogoH3>
          </SectionColWrapper>
          <SectionColWrapper small>
            <RyogoSmall>{ongoingTrip.vehicle}</RyogoSmall>
            <RyogoCaption weight="font-bold">{ongoingTrip.driver}</RyogoCaption>
          </SectionColWrapper>
        </SectionColWrapper>
        <SectionColWrapper end justifyBetween>
          <SectionColWrapper small end>
            <RyogoSmall>{ongoingTrip.customerName}</RyogoSmall>
            <RyogoCaption weight="font-bold">
              {ongoingTrip.bookingId}
            </RyogoCaption>
          </SectionColWrapper>
          {ongoingTrip.status && (
            <TripLogStatusPill status={ongoingTrip.status} />
          )}
        </SectionColWrapper>
      </div>
    </Link>
  )
}
