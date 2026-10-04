import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardPendingPaymentsType } from "@ryogo-travel-app/api/services/booking.services"
import { DashboardBoxItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

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

  // const dueDate = trip.actualEndDate ?? trip.endDate
  const totalAmount = trip.actualTotalAmount ?? trip.estimatedTotalAmount
  const pendingAmount = totalAmount - trip.customerPaidAmount

  return (
    <Link href={`/dashboard/bookings/${trip.id}/transactions`}>
      <DashboardBoxItemWrapper highlight={highlight}>
        <SectionRowWrapper className="justify-between">
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
          <GetTripTypeIcon type={trip.type} size="sm" thick />
          <RyogoH4 weight="font-bold">{trip.destination.city}</RyogoH4>
        </SectionRowWrapper> */}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoImageIconTag
            url={customerImageUrl}
            label={trip.customer.name}
          />
          <SectionColWrapper small className="items-end">
            <RyogoP color="dark">{t("Due", { amount: pendingAmount })}</RyogoP>
          </SectionColWrapper>
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
