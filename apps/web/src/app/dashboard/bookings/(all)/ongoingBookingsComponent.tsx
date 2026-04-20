import { Caption, H5Grey, PBold, SmallGrey } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { LucideRoute } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "@/components/page/pageCommons"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"

export default async function OngoingBookingsComponent({
  ongoingTrips,
}: {
  ongoingTrips: FindOngoingTripsType
}) {
  const t = await getTranslations("Dashboard.Bookings.Ongoing")

  return (
    <div id="OngoingBookingsSection" className={sectionClassName}>
      <div id="OngoingBookingsHeader" className={sectionHeaderClassName}>
        <LucideRoute className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{ongoingTrips.length}</H5Grey>
      </div>
      {ongoingTrips.map((trip) => (
        <OngoingComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  )
}

function OngoingComponent(props: NonNullable<FindOngoingTripsType>[number]) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </div>
        {props.status && (
          <div className={gridItemClassName}>
            <TripLogStatusPill status={props.status} />
          </div>
        )}
      </div>
    </Link>
  )
}
