"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateVehicleAction({
  vehicleId,
  agencyId,
}: {
  vehicleId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const inactivatedVehicle = await vehicleServices.inactivateVehicle(vehicleId)
  if (!inactivatedVehicle) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.VEHICLE,
    entityId: inactivatedVehicle.id,
    isFeed: true,
    textKey: "VehicleInactivated",
    textObject: {
      vehicleNumber: inactivatedVehicle.vehicleNumber,
      userName: currentUser.name,
    },
    link: `/dashboard/vehicles/${inactivatedVehicle.id}`,
  })

  return inactivatedVehicle
}
