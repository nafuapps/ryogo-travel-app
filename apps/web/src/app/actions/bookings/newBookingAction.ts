"use server"

import { getCurrentUser } from "@/lib/auth"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { addDays } from "date-fns"

export async function newBookingAction(data: CreateNewBookingRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  const booking = await bookingServices.addNewBooking(data)
  if (!booking) return

  //Add mission to confirm this new booking
  await missionServices.addMission({
    agencyId: data.agencyId,
    userId: booking.assignedUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: booking.id,
    dueDate: addDays(data.tripEndDate, OLD_LEAD_AUTO_CANCEL_DAYS),
    isCritical: true,
    titleKey: "LeadBooking.Title",
    titleObject: { bookingId: booking.id },
    messageKey: "LeadBooking.Message",
    link: `/dashboard/bookings/${booking.id}/confirm`,
  })

  return booking
}
