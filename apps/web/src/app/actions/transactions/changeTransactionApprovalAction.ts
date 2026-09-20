"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeTransactionApprovalAction(
  txnId: string,
  status: boolean,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedTransaction =
    await transactionServices.modifyTransactionApprovalStatus(txnId, status)
  if (!updatedTransaction) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.TRANSACTION,
    entityId: updatedTransaction.id,
    textKey: status ? "TransactionApproved" : "TransactionRejected",
    textObject: {
      txnId: updatedTransaction.id,
      bookingId: updatedTransaction.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedTransaction.bookingId}/transactions`,
  })

  return updatedTransaction
}
