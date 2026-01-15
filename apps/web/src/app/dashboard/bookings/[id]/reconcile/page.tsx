//Bookings/id/reconcile page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { BookingRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import ReconcileBookingPageComponent from "./reconcileBooking"

export default async function ReconcileBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only owner can reconcile booking
  if (user?.userRole != "owner") {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //No booking found or agency mismatch
  const booking = await bookingServices.findBookingDetailsById(id)
  if (!booking || booking.agency.id !== user?.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only completed booking can be reconciled
  if (booking.status !== BookingStatusEnum.COMPLETED || booking.isReconciled) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
      <ReconcileBookingPageComponent booking={booking} />
    </div>
  )
}
