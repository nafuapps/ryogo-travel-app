"use server"

import { getCurrentUser } from "@/lib/auth"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeExpenseApprovalAction(
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
  const updatedExpense = await expenseServices.modifyExpenseApprovalStatus(
    txnId,
    status,
  )
  return updatedExpense
}
