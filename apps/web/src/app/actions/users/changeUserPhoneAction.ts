"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserPhoneAction({
  userId,
  phone,
  agencyId,
  role,
}: {
  userId: string
  phone: string
  agencyId: string
  role: UserRolesEnum
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) return

  const user = await userServices.changeUserPhone({ userId, phone, role })
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "UserPhoneChanged",
    textObject: {
      userName: user.name,
      phone: phone,
      adminName: currentUser.name,
    },
  })
  return user
}
