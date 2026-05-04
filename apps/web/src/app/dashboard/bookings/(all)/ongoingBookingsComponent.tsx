import { Caption, H5Grey, PBold, SmallGrey } from "@/components/typography"
import { FindOngoingTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { LucideRoute } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { iconClassName } from "@/components/page/pageCommons"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

export default async function OngoingBookingsComponent({
  ongoingTrips,
}: {
  ongoingTrips: FindOngoingTripsType
}) {
  const t = await getTranslations("Dashboard.Bookings.Ongoing")

  return (
    <SectionWrapper id="OngoingBookingsSection">
      <SectionHeaderWrapper>
        <LucideRoute className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{ongoingTrips.length}</H5Grey>
      </SectionHeaderWrapper>
      {ongoingTrips.map((trip) => (
        <OngoingComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function OngoingComponent(props: NonNullable<FindOngoingTripsType>[number]) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </GridItemWrapper>
        {props.status && (
          <GridItemWrapper>
            <TripLogStatusPill status={props.status} />
          </GridItemWrapper>
        )}
      </GridWrapper>
    </Link>
  )
}
