"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function deleteTransactionAction({
  transactionId,
  agencyId,
  assignedUserId,
}: {
  transactionId: string
  agencyId: string
  assignedUserId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: assignedUserId,
  })
  if (!currentUser) return

  const deletedTransaction =
    await transactionServices.removeTransaction(transactionId)
  if (!deletedTransaction) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.TRANSACTION,
    entityId: deletedTransaction.id,
    textKey: "TransactionRemoved",
    textObject: {
      txnId: deletedTransaction.id,
      bookingId: deletedTransaction.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${deletedTransaction.bookingId}/transactions`,
  })

  return deletedTransaction
}
