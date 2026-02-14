//Bookings/id/assign-user page (only for owner)

import { BookingRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import AssignUserPageComponent from "./assignUser"

export default async function AssignUserBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only owner can assign user
  if (user.userRole !== UserRolesEnum.OWNER) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(id)

  //No booking found or agency mismatch
  if (!booking || booking.agency.id !== user.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is a lead booking and old, cancel it automatically
  if (
    booking.status === BookingStatusEnum.LEAD &&
    new Date(booking.endDate) < new Date()
  ) {
    if (
      await cancelBookingAction(
        booking.id,
        booking.agencyId,
        booking.assignedUserId,
      )
    ) {
      redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
    } else {
      redirect(`/dashboard/bookings`, RedirectType.replace)
    }
  }

  //Get users data with their bookings and leaves (for available users and allowance per day)
  const users = await userServices.findOwnerAndAgentsByAgency(user.agencyId)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-user"} />
      <AssignUserPageComponent bookingId={id} users={users} booking={booking} />
    </div>
  )
}
