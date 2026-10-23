"use server"

import { writePermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { redirect, RedirectType } from "next/navigation"

export async function autoCancelBookingAction({
  bookingId,
  agencyId,
}: {
  bookingId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) {
    return
  }

  const canceledBooking = await bookingServices.cancelBooking(bookingId)
  if (!canceledBooking) return

  //Remove any missions for this booking
  await missionServices.removePreviousMissionsByEntityId({
    agencyId,
    entityId: bookingId,
  })

  redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
}
