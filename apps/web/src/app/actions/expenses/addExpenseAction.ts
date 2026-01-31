"use server"

import { generateExpensePhotoPathName } from "@/lib/utils"
import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addExpenseAction(data: AddExpenseRequestType) {
  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense) return false

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
  return true
}
