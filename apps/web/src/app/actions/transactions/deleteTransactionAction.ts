"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function deleteTransactionAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const deletedTransaction = await transactionServices.removeTransaction(id)
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
