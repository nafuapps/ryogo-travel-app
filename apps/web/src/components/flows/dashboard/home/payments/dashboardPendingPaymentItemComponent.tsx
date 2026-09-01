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
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import moment from "moment"
import { getTranslations } from "next-intl/server"

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
      <div
        className={`flex flex-col gap-2 lg:gap-3 justify-between w-full border ${highlight ? "border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-950" : "border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-3 lg:p-4`}
      >
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
      </div>
    </Link>
  )
}
