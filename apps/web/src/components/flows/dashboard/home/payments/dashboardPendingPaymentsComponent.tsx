import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import {
  DashboardRow,
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
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

  if (pendingPaymentBookings.length === 0) {
    return null
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
      {completedPending.length > 0 && (
        <DashboardRow>
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
        </DashboardRow>
      )}
      {inProgressPending.length > 0 && (
        <DashboardRow>
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
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}
