"use server"

import { writePermissions } from "@/lib/permissions"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeExpenseApprovalAction({
  expenseId,
  isApproved,
  agencyId,
  assignedUserId,
}: {
  expenseId: string
  isApproved: boolean
  agencyId: string
  assignedUserId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) return

  const updatedExpense = await expenseServices.modifyExpenseApprovalStatus({
    expenseId,
    isApproved,
  })
  if (!updatedExpense) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.EXPENSE,
    entityId: updatedExpense.id,
    textKey: isApproved ? "ExpenseApproved" : "ExpenseRejected",
    textObject: {
      expenseId: updatedExpense.id,
      bookingId: updatedExpense.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedExpense.bookingId}/expenses`,
  })

  return updatedExpense
}
