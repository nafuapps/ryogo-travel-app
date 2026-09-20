"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeVehicleNumberAction(
  vehicleId: string,
  agencyId: string,
  addedByUserId: string,
  newVehicleNumber: string,
  oldVehicleNumber: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== addedByUserId) ||
    currentUser.agencyId !== agencyId ||
    oldVehicleNumber === newVehicleNumber
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const vehicle = await vehicleServices.changeVehicleNumber(
    vehicleId,
    newVehicleNumber,
  )
  if (!vehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: vehicle.id,
    isFeed: true,
    textKey: "VehicleNumberModified",
    textObject: {
      oldVehicleNumber: oldVehicleNumber,
      newVehicleNumber: vehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${vehicle.id}`,
  })

  return vehicle
}
