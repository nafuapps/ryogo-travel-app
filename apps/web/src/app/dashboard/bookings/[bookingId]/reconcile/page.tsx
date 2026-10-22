import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { APP_TRIAL_MODE } from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import ReconcileBookingPageComponent from "./reconcileBooking"

export const metadata: Metadata = {
  title: `Reconcile Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ReconcileBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  const { bookingId } = await params

  //Get booking data
  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only owner can reconcile a booking (which must be closed but not reconciled yet)
  if (
    currentUser.userRole !== UserRolesEnum.OWNER ||
    booking.status !== BookingStatusEnum.COMPLETED ||
    !booking.closedAt ||
    booking.reconciledAt
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //SUBSCRIPTION BLOCKER: Only premium agencies can reconcile booking
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.ReconcileBooking")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
        <PageWrapper id="ReconcileBookingPage">
          <SubscriptionBlockerSection
            warningText={
              isSubscribed
                ? t("ReconcileExpiredWarning")
                : t("ReconcileTrialWarning")
            }
            actionText={
              isSubscribed
                ? t("ReconcileExpiredAction")
                : t("ReconcileTrialAction")
            }
            isOwner
            ctaLabel={
              isSubscribed
                ? t("RenewCTA")
                : currentUser.hasTriedSubscription
                  ? t("BuyCTA")
                  : t("TryCTA")
            }
          />
        </PageWrapper>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
      <ReconcileBookingPageComponent booking={booking} />
    </MainWrapper>
  )
}
