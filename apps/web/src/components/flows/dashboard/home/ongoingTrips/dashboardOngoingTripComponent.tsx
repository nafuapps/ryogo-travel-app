import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoH4, RyogoSmall } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"

import Link from "next/link"

export default async function DashboardOngoingTripComponent({
  ongoingTrip,
  userId,
}: {
  ongoingTrip: NonNullable<FindOngoingTripsType>[number]
  userId: string
}) {
  const t = await getTranslations("Dashboard.Home.OngoingTrips")
  const isAssigned = ongoingTrip.assignedUserId === userId

  return (
    <Link
      href={`/dashboard/bookings/${ongoingTrip.bookingId}`}
      className="flex"
    >
      <div
        className={`relative overflow-hidden flex flex-col gap-3 lg:gap-4 w-full border ${isAssigned ? "border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-800" : "border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-4 lg:p-5`}
      >
        {isAssigned && (
          <div className="absolute top-0 right-0 rounded-bl-lg bg-sky-100 dark:bg-sky-800 px-2 lg:px-3 py-1 lg:py-1.5">
            <RyogoCaption weight="font-bold" color="brand">
              {t("Assigned")}
            </RyogoCaption>
          </div>
        )}
        <SectionColWrapper small>
          <RyogoCaption weight="font-bold" color="light">
            {ongoingTrip.type.toUpperCase()}
          </RyogoCaption>
          <RyogoH4>{ongoingTrip.route.toUpperCase()}</RyogoH4>
        </SectionColWrapper>
        <SectionRowWrapper>
          <SectionColWrapper small>
            <RyogoCaption weight="font-bold" color="light">
              {ongoingTrip.driver}
            </RyogoCaption>
            <RyogoSmall>{ongoingTrip.vehicle}</RyogoSmall>
          </SectionColWrapper>
          <SectionColWrapper small end>
            <RyogoCaption weight="font-bold" color="light">
              {ongoingTrip.bookingId}
            </RyogoCaption>
            <RyogoSmall>{ongoingTrip.customerName}</RyogoSmall>
          </SectionColWrapper>
        </SectionRowWrapper>
        {ongoingTrip.status && (
          <TripLogStatusPill status={ongoingTrip.status} />
        )}
      </div>
    </Link>
  )
}
