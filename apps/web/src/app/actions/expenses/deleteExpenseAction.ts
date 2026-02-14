"use server"

import { getCurrentUser } from "@/lib/auth"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function deleteExpenseAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userRole !== UserRolesEnum.DRIVER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const deletedExpense = await expenseServices.removeExpense(id)
  return deletedExpense
}
