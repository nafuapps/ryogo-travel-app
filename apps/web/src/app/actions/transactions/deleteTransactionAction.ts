"use server"

import { getCurrentUser } from "@/lib/auth"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  const deletedTransaction = await transactionServices.removeTransaction(id)
  return deletedTransaction
}
