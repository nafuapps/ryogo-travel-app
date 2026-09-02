import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardLeadsType } from "@ryogo-travel-app/api/services/booking.services"
import { User } from "lucide-react"
import {
  DashboardBoxItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Link from "next/link"

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
        <SectionRowWrapper small center>
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {trip.startDate.toLocaleDateString()}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small center>
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon tripType={trip.type} size="sm" color="light" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper small center>
          <SectionRowWrapper>
            <DashboardLabelImageChip label={trip.customer.name}>
              {customerImageUrl ? (
                <RyogoImage
                  src={getFileUrl(customerImageUrl)}
                  alt={trip.customer.name}
                  imageSize="xs"
                />
              ) : (
                <RyogoEnclosedIcon icon={User} size="sm" />
              )}
            </DashboardLabelImageChip>
          </SectionRowWrapper>
          <RyogoP color="slate" weight="font-medium">
            {"₹" + trip.estimatedTotalAmount}
          </RyogoP>
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
