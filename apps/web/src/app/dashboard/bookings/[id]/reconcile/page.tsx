//Bookings/id/reconcile page (only accessible to owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import ReconcileBookingPageComponent from "./reconcileBooking"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Reconcile Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ReconcileBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owner can reconcile booking
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(id)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only completed booking can be reconciled
  if (booking.status !== BookingStatusEnum.COMPLETED || booking.isReconciled) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
      <ReconcileBookingPageComponent booking={booking} />
    </MainWrapper>
  )
}
