"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  if (!updatedExpense) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.EXPENSE,
    entityId: updatedExpense.id,
    textKey: status ? "ExpenseApproved" : "ExpenseRejected",
    textObject: {
      expenseId: updatedExpense.id,
      bookingId: updatedExpense.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedExpense.bookingId}/expenses`,
  })

  return updatedExpense
}
