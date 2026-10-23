"use server"

import { ResetPasswordEmailTemplate } from "@/components/email/resetPasswordEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

//Owner resetting user's password flow
export async function resetUserPasswordAction({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const user = await userServices.resetUserPassword({ userId, agencyId })
  if (!user) return

  //Send password reset email to the user
  await sendEmail({
    receipientEmail: [user.email],
    subject: "Password Reset successful",
    element: ResetPasswordEmailTemplate({
      name: user.name,
      password: user.password,
    }),
  })

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: userId,
    textKey: "UserPasswordReset",
    textObject: {
      userName: user.name,
      adminName: currentUser.name,
    },
    link: `/dashboard/users/${userId}`,
  })

  const { password, ...userWithoutPassword } = user

  return userWithoutPassword
}
