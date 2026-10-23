import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { OrderIdRegex } from "@/lib/regex"
import { BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { ProductFeedbackTypeEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import SubscriptionPageComponent from "./subscription"

export const metadata: Metadata = {
  title: `Subscription - ${pageTitle}`,
  description: pageDescription,
}

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{
    feedback?: string
    orderId?: string
  }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { feedback, orderId } = await searchParams

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  const agencyDetails = await agencyServices.findAgencyById(
    currentUser.agencyId,
  )

  if (!userDetails || !agencyDetails) {
    notFound()
  }

  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (!agencyData) {
    notFound()
  }

  //Find last X days confirmed bookings
  const confirmedBookings =
    await bookingServices.findAccountableBookingsPreviousDays(
      currentUser.agencyId,
      BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
    )

  const lastPaidOrder = await orderServices.findLastPaidOrder(
    currentUser.agencyId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/subscription"} />
      {feedback === "true" &&
        orderId &&
        OrderIdRegex.safeParse(orderId).success && (
          <NewFeedbackComponent
            entityId={orderId}
            feedbackType={ProductFeedbackTypeEnum.NEW_ORDER}
            userId={currentUser.userId}
            agencyId={currentUser.agencyId}
          />
        )}
      <AccountDetailHeaderTabs selectedTab="Subscription" />
      <SubscriptionPageComponent
        userDetails={userDetails}
        agencyDetails={agencyDetails}
        agencyData={agencyData}
        confirmedBookingsLength={confirmedBookings.length}
        lastPaidOrder={lastPaidOrder}
      />
    </MainWrapper>
  )
}
