import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardLeadsType } from "@ryogo-travel-app/api/services/booking.services"
import { User } from "lucide-react"
import Link from "next/link"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"

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
      <div
        className={`flex flex-col gap-2 lg:gap-3 justify-between w-full border ${highlight ? "border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-950" : "border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-3 lg:p-4`}
      >
        <SectionRowWrapper center>
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {trip.startDate.toLocaleDateString()}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper>
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon tripType={trip.type} size="sm" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper center>
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
      </div>
    </Link>
  )
}
