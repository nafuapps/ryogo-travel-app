import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import SubscriptionPageComponent from "./subscription"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS } from "@/lib/uiConfig"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { ProductFeedbackTypeEnum } from "@ryogo-travel-app/db/schema"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import { OrderIdRegex } from "@/lib/regex"

export const metadata: Metadata = {
  title: `Subscription - ${pageTitle}`,
  description: pageDescription,
}

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{
    feedback?: string | undefined
    orderId?: string | undefined
  }>
}) {
  const currentUser = await getCurrentUser()

  const { feedback, orderId } = await searchParams

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  const agencyDetails = await agencyServices.findAgencyById(
    currentUser.agencyId,
  )

  if (!userDetails || !agencyDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)

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
