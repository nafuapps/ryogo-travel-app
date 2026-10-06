"use server"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateTripLogPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function midTripAction({ data }: { data: AddTripLogRequestType }) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  // Create Mid Trip Log
  const newTripLog = await tripLogServices.addTripLog(data)
  if (!newTripLog) return

  //Upload triplog photo if attached
  const [tripLogPhotoFile] = data.tripLogPhoto || []
  if (tripLogPhotoFile) {
    const uploadedFile = await uploadFile(
      tripLogPhotoFile,
      generateTripLogPhotoPathName(
        data.bookingId,
        newTripLog.id,
        tripLogPhotoFile,
      ),
    )
    await tripLogServices.changeTripLogPhotoUrl({
      tripLogId: newTripLog.id,
      tripLogPhotoUrl: uploadedFile.path,
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: data.bookingId,
    textKey: "MidTrip",
    textObject: {
      type: data.type,
      bookingId: data.bookingId,
      driverName: currentUser.name,
    },
    link: `/dashboard/bookings/${data.bookingId}/trip-logs`,
  })

  return newTripLog
}
