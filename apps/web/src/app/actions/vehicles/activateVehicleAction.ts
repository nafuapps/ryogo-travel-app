"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function activateVehicleAction({
  vehicleId,
  agencyId,
}: {
  vehicleId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) {
    return
  }

  const vehicle = await vehicleServices.activateVehicle(vehicleId)
  if (!vehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: vehicle.id,
    isFeed: true,
    textKey: "VehicleActivated",
    textObject: {
      vehicleNumber: vehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${vehicle.id}`,
  })

  return vehicle
}
