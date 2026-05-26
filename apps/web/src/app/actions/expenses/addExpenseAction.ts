"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateExpensePhotoPathName } from "@/lib/utils"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addExpenseAction(
  data: AddExpenseRequestType,
  byDriver?: boolean,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userRole !== UserRolesEnum.DRIVER &&
      data.assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense) return

  //If there is a url for expense photo, upload it to cloud storage
  if (data.expensePhoto && data.expensePhoto[0]) {
    const file = data.expensePhoto[0]
    const uploadResult = await uploadFile(
      file,
      generateExpensePhotoPathName(data.bookingId, addedExpense.id, file),
    )
    await expenseServices.changeExpensePhotoUrl(
      addedExpense.id,
      uploadResult.path,
    )
  }

  if (byDriver) {
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: data.assignedUserId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: data.bookingId,
      titleKey: "ExpenseAddedByDriver.Title",
      titleObject: {
        expenseId: addedExpense.id,
        type: addedExpense.type.toUpperCase(),
        bookingId: data.bookingId,
      },
      messageKey: "ExpenseAddedByDriver.Message",
      link: `/dashboard/bookings/${data.bookingId}/expenses`,
    })
  }

  return addedExpense
}
