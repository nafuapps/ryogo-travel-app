import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import {
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Separator } from "@/components/ui/separator"
import DashboardPendingPaymentComponent from "./dashboardPendingPaymentItemComponent"

export default async function DashboardPendingPaymentsComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.PendingPayments")

  let pendingPaymentBookings =
    await bookingServices.findDashboardPendingPayments(agencyId)
  if (!isOwner) {
    pendingPaymentBookings = pendingPaymentBookings.filter(
      (booking) => booking.assignedUser.id === userId,
    )
  }

  const inProgressPending = pendingPaymentBookings.filter(
    (booking) => booking.status === BookingStatusEnum.IN_PROGRESS,
  )
  const completedPending = pendingPaymentBookings.filter(
    (booking) => booking.status === BookingStatusEnum.COMPLETED,
  )

  return (
    <SectionWrapper id="DashboardPendingPayments">
      <DashboardSectionHeader title={t("Title")} />
      <DashboardRowHeader
        title={t("Completed")}
        count={completedPending.length}
      />
      {completedPending.map((booking, index) => (
        <DashboardPendingPaymentComponent
          key={index}
          trip={booking}
          userId={userId}
          isOwner={isOwner}
        />
      ))}
      <Separator />
      <DashboardRowHeader
        title={t("InProgress")}
        count={inProgressPending.length}
      />
      {inProgressPending.map((booking, index) => (
        <DashboardPendingPaymentComponent
          key={index}
          trip={booking}
          userId={userId}
          isOwner={isOwner}
        />
      ))}
    </SectionWrapper>
  )
}
