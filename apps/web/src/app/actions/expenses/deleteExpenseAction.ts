"use server"

import { getCurrentUser } from "@/lib/auth"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function deleteExpenseAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  byDriver?: boolean,
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
  if (!deletedExpense) return

  if (byDriver) {
    await missionServices.removePreviousMissionsByEntityKey(
      agencyId,
      EntityTypeEnum.EXPENSE,
      deletedExpense.id,
      "ExpenseAddedByDriver.Title",
    )
    await missionServices.removePreviousMissionsByEntityKey(
      agencyId,
      EntityTypeEnum.EXPENSE,
      deletedExpense.id,
      "ExpenseModifiedByDriver.Title",
    )
    await missionServices.addMission({
      agencyId: agencyId,
      userId: assignedUserId,
      entityType: EntityTypeEnum.EXPENSE,
      entityId: deletedExpense.id,
      titleKey: "ExpenseDeletedByDriver.Title",
      titleObject: {
        expenseId: deletedExpense.id,
        type: deletedExpense.type.toUpperCase(),
        bookingId: deletedExpense.bookingId,
      },
      messageKey: "ExpenseDeletedByDriver.Message",
      link: `/dashboard/bookings/${deletedExpense.bookingId}/expenses`,
    })
  }

  return deletedExpense
}
