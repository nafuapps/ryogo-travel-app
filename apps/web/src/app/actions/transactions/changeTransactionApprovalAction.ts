"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeTransactionApprovalAction({
  transactionId,
  isApproved,
  assignedUserId,
  agencyId,
}: {
  transactionId: string
  isApproved: boolean
  assignedUserId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: assignedUserId,
  })
  if (!currentUser) return

  const updatedTransaction =
    await transactionServices.modifyTransactionApprovalStatus({
      transactionId,
      isApproved,
    })
  if (!updatedTransaction) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.TRANSACTION,
    entityId: updatedTransaction.id,
    textKey: isApproved ? "TransactionApproved" : "TransactionRejected",
    textObject: {
      txnId: updatedTransaction.id,
      bookingId: updatedTransaction.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedTransaction.bookingId}/transactions`,
  })

  return updatedTransaction
}
