import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH4, RyogoP } from "@/components/typography"
import { FindDashboardPendingPaymentsType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import {
  DashboardBoxItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function DashboardPendingPaymentComponent({
  trip,
  userId,
  isOwner,
}: {
  trip: FindDashboardPendingPaymentsType[number]
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.PendingPayments")
  const highlight = isOwner && trip.assignedUser.id === userId
  const customerImageUrl = trip.customer.photoUrl

  const dueDate = trip.actualEndDate ?? trip.endDate
  const totalAmount = trip.actualTotalAmount ?? trip.estimatedTotalAmount
  const pendingAmount = totalAmount - trip.customerPaidAmount

  return (
    <Link href={`/dashboard/bookings/${trip.id}/transactions`}>
      <DashboardBoxItemWrapper highlight={highlight}>
        <SectionRowWrapper>
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          {/* <RyogoCaption color={dueDate < new Date() ? "red" : "slate"}>
            {moment(dueDate).fromNow()}
          </RyogoCaption> */}
          <RyogoCaption color="light">
            {t("Total", { amount: totalAmount })}
          </RyogoCaption>
        </SectionRowWrapper>
        {/* <SectionRowWrapper>
          <RyogoH4 weight="font-bold">{trip.source.city}</RyogoH4>
          <GetTripTypeIcon tripType={trip.type} size="sm" thick />
          <RyogoH4 weight="font-bold">{trip.destination.city}</RyogoH4>
        </SectionRowWrapper> */}
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
          <SectionColWrapper small end>
            <RyogoP color="dark">{t("Due", { amount: pendingAmount })}</RyogoP>
          </SectionColWrapper>
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
