import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import ReconcileBookingPageComponent from "./reconcileBooking"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import { getTranslations } from "next-intl/server"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export const metadata: Metadata = {
  title: `Reconcile Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ReconcileBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only owner can reconcile booking (which must be in completed state)
  if (
    currentUser.userRole !== UserRolesEnum.OWNER ||
    booking.status !== BookingStatusEnum.COMPLETED ||
    booking.isReconciled
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //SUBSCRIPTION BLOCKER: Only premium agencies can reconcile booking
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.ReconcileBooking")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
        <SubscriptionBlockerSection
          warningText={
            isBasic ? t("ReconcileTrialWarning") : t("ReconcileExpiredWarning")
          }
          actionText={
            isBasic ? t("ReconcileTrialAction") : t("ReconcileExpiredAction")
          }
          isOwner
          ctaLabel={
            isBasic
              ? agency.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
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
