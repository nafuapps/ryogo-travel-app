"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  return updatedTransaction
}
