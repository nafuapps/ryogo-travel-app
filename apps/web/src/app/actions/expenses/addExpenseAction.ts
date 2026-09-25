"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateExpensePhotoPathName } from "@/lib/utils"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addExpenseAction(
  data: AddExpenseRequestType,
  isRider?: boolean,
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

  if (!(await verifyCurrentUser())) {
    return
  }

  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense) return

  //If there is an expense photo, upload it to cloud storage
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

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.EXPENSE,
    entityId: addedExpense.id,
    textKey: "ExpenseAdded",
    textObject: {
      expenseId: addedExpense.id,
      bookingId: data.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${data.bookingId}/expenses`,
  })

  if (isRider) {
    await missionServices.addMission({
      agencyId: data.agencyId,
      userId: data.assignedUserId,
      entityType: EntityTypeEnum.EXPENSE,
      entityId: addedExpense.id,
      titleKey: "ExpenseAddedByDriver.Title",
      titleObject: {
        bookingId: data.bookingId,
      },
      messageKey: "ExpenseAddedByDriver.Message",
      messageObject: {
        expenseId: addedExpense.id,
        type: addedExpense.type,
      },
      link: `/dashboard/bookings/${data.bookingId}/expenses`,
    })
  }

  return addedExpense
}
