"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateExpensePhotoPathName } from "@/lib/utils"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UpdateExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyExpenseAction(
  data: UpdateExpenseRequestType,
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
  //If there is a url for expense photo, upload it to cloud storage
  if (data.expensePhoto && data.expensePhoto[0]) {
    const file = data.expensePhoto[0]
    const uploadResult = await uploadFile(
      file,
      generateExpensePhotoPathName(data.bookingId, data.expenseId, file),
    )
    await expenseServices.changeExpensePhotoUrl(
      data.expenseId,
      uploadResult.path,
    )
  }

  const updatedExpense = await expenseServices.modifyExpense(data)
  return updatedExpense
}
