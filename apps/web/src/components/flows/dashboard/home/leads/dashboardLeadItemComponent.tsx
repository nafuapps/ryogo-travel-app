import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardLeadsType } from "@ryogo-travel-app/api/services/booking.services"
import { DashboardBoxItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { format } from "date-fns"

export default async function DashboardLeadItemComponent({
  trip,
  userId,
  isOwner,
}: {
  trip: FindDashboardLeadsType[number]
  userId: string
  isOwner: boolean
}) {
  const isLate = trip.endDate < new Date()
  const highlight = isOwner && trip.assignedUser.id === userId
  const customerImageUrl = trip.customer.photoUrl

  return (
    <Link href={`/dashboard/bookings/${trip.id}`}>
      <DashboardBoxItemWrapper highlight={highlight}>
        <SectionRowWrapper small className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {format(trip.startDate, "dd MMM")}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon type={trip.type} size="sm" color="light" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          <SectionRowWrapper>
            <RyogoImageIconTag
              url={customerImageUrl}
              label={trip.customer.name}
            />
          </SectionRowWrapper>
          <RyogoP color="slate" weight="font-medium">
            {"₹" + trip.estimatedTotalAmount}
          </RyogoP>
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
