"use server"

import { writePermissions } from "@/lib/permissions"
import { generateExpensePhotoPathName } from "@/lib/utils"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addExpenseAction(
  data: AddExpenseRequestType,
  isRider?: boolean,
) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.assignedUserId,
  })
  if (!currentUser) return

  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense) return

  //If there is an expense photo, upload it to cloud storage
  const file = data.expensePhoto
  if (file) {
    const uploadResult = await uploadFile(
      file,
      generateExpensePhotoPathName(data.bookingId, addedExpense.id),
    )
    await expenseServices.changeExpensePhotoUrl({
      expenseId: addedExpense.id,
      expensePhotoUrl: uploadResult.path,
    })
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
