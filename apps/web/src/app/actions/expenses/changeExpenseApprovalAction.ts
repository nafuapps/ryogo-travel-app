"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeExpenseApprovalAction(
  expId: string,
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

  const updatedExpense = await expenseServices.modifyExpenseApprovalStatus(
    expId,
    status,
  )
  return updatedExpense
}
