"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeUserEmailAction({
  userId,
  agencyId,
  email,
}: {
  userId: string
  agencyId: string
  email: string
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) return

  const user = await userServices.changeUserEmail({ userId, email })
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "UserEmailChanged",
    textObject: {
      userName: user.name,
      email: email,
      adminName: currentUser.name,
    },
  })

  return user
}
