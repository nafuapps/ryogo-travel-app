import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { CustomerIdRegex } from "@/lib/regex"
import { BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import NewBookingWithCustomerPageComponent from "./newBookingWithCustomer"

export const metadata: Metadata = {
  title: `Create Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewBookingCustomerPage({
  params,
}: {
  params: Promise<{
    customerId: string
  }>
}) {
  const { customerId } = await params

  if (CustomerIdRegex.safeParse(customerId).success === false) {
    redirect("/dashboard/bookings/new", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (
    !customer ||
    customer.agencyId !== currentUser.agencyId ||
    customer.status !== CustomerStatusEnum.ACTIVE
  ) {
    redirect("/dashboard/bookings/new", RedirectType.replace)
  }

  //Find last X days confirmed bookings
  const confirmedBookings =
    await bookingServices.findAccountableBookingsPreviousDays(
      currentUser.agencyId,
      BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
    )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/new/[id]"} />
      <NewBookingWithCustomerPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        confirmedBookingsLength={confirmedBookings.length}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        customerId={customerId}
        isSubscribed={currentUser.isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
        subscriptionExpiresOn={currentUser.subscriptionExpiresOn}
      />
    </MainWrapper>
  )
}
