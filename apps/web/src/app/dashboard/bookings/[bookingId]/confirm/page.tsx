import { autoCancelBookingAction } from "@/app/actions/bookings/autoCancelBookingAction"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import ConfirmBookingPageComponent from "./confirmBookingForm"

export const metadata: Metadata = {
  title: `Confirm Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  const { bookingId } = await params

  //Get lead booking details from DB
  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Not a lead booking -> send to booking details page
  if (booking.status !== BookingStatusEnum.LEAD) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //If it is an old lead booking, cancel it automatically
  if (
    differenceInDays(new Date(), booking.startDate) > OLD_LEAD_AUTO_CANCEL_DAYS
  ) {
    await autoCancelBookingAction({
      bookingId: booking.id,
      agencyId: booking.agencyId,
    })
  }

  //Only owner or assigned user can confirm a booking
  if (
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.userId !== booking.assignedUserId
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //Find last X days confirmed bookings
  const confirmedBookings =
    await bookingServices.findAccountableBookingsPreviousDays(
      currentUser.agencyId,
      BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
    )

  //SUBSCRIPTION BLOCKER: Monthly confirmed booking limit reached
  if (
    !APP_TRIAL_MODE &&
    confirmedBookings.length >= BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT &&
    (!isSubscribed ||
      //Check if premium expired more than X days ago
      differenceInDays(new Date(), currentUser.subscriptionExpiresOn) >
        BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS)
  ) {
    const t = await getTranslations("Dashboard.ConfirmBooking")
    return (
      <PageWrapper id="ConfirmBookingLimitBlockerPage">
        <SubscriptionBlockerSection
          warningText={
            isSubscribed ? t("BookingExpiredWarning") : t("BookingTrialWarning")
          }
          actionText={
            isSubscribed ? t("BookingExpiredAction") : t("BookingTrialAction")
          }
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          ctaLabel={
            isSubscribed
              ? t("RenewCTA")
              : currentUser.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
          }
        />
      </PageWrapper>
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/confirm"} />
      <ConfirmBookingPageComponent booking={booking}>
        <BookingTripCard {...booking} />
      </ConfirmBookingPageComponent>
    </MainWrapper>
  )
}
