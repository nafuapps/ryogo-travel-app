"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyDriverRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function modifyDriverAction({
  data,
}: {
  data: ModifyDriverRequestType
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.addedByUserId,
  })
  if (!currentUser) return

  const modifiedDriver = await driverServices.modifyDriver(data)
  if (!modifiedDriver) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: modifiedDriver.id,
    isFeed: true,
    textKey: "DriverModified",
    textObject: {
      driverName: modifiedDriver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${modifiedDriver.id}`,
  })

  return modifiedDriver
}
