import { InsertExpenseType } from "@ryogo-travel-app/db/schema"
import { expenseRepository } from "../repositories/expense.repo"
import {
  AddExpenseRequestType,
  UpdateExpenseRequestType,
} from "../types/expense.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export const expenseServices = {
  //Add a expense
  async addExpense(data: AddExpenseRequestType) {
    const newExpenseData: InsertExpenseType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      remarks: data.remarks,
      agencyId: data.agencyId,
    }
    const addedExpense = await expenseRepository.createExpense(newExpenseData)
    console.log("Added Expense:", addedExpense)
    const expenseId = addedExpense[0]?.id

    //If there is a url for expense photo, upload it to cloud storage
    if (data.expensePhoto && data.expensePhoto.length > 0 && expenseId) {
      this.uploadExpensePhoto(expenseId, data.expensePhoto[0]!)
    }

    return addedExpense
  },

  //Modify an expense's details
  async modifyExpense(data: UpdateExpenseRequestType) {
    let photoUrl
    //If there is a url for expense photo, upload it to cloud storage
    if (data.expensePhoto && data.expensePhoto.length > 0) {
      photoUrl = await this.uploadExpensePhoto(
        data.expenseId,
        data.expensePhoto[0]!
      )
    }

    const updatedExpense = photoUrl
      ? await expenseRepository.updateExpenseDetails(
          data.expenseId,
          data.amount,
          data.type,
          data.remarks,
          photoUrl
        )
      : await expenseRepository.updateExpenseDetails(
          data.expenseId,
          data.amount,
          data.type,
          data.remarks
        )
    return updatedExpense
  },

  //Upload expense photo
  async uploadExpensePhoto(expenseId: string, file: File) {
    //Name file
    const fileName = `${Date.now()}-${file?.name}`

    // Upload to Supabase Storage
    const uploadResult = await uploadFile(
      file!,
      `${expenseId}/proof/${fileName}`
    )

    //Update photoUrl in DB
    const photoUrl = uploadResult!.path
    await expenseRepository.updateExpensePhotoUrl(expenseId, photoUrl)
    return photoUrl
  },

  //Get expense details by expense id
  async getExpenseDetailsById(expenseId: string) {
    return expenseRepository.readExpenseById(expenseId)
  },

  //Delete a expense
  async removeExpense(expenseId: string) {
    return expenseRepository.deleteExpense(expenseId)
  },
}
