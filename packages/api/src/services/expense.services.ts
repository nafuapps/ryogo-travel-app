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
    if (!addedExpense[0]) return

    //If there is a url for expense photo, upload it to cloud storage
    if (data.expensePhoto && data.expensePhoto[0]) {
      await expenseServices.uploadExpensePhoto(
        addedExpense[0].id,
        data.expensePhoto[0],
      )
    }
    return addedExpense[0]
  },

  //Modify an expense's details
  async modifyExpense(data: UpdateExpenseRequestType) {
    //If there is a url for expense photo, upload it to cloud storage
    if (data.expensePhoto && data.expensePhoto[0]) {
      await this.uploadExpensePhoto(data.expenseId, data.expensePhoto[0])
    }

    const updatedExpense = await expenseRepository.updateExpenseDetails(
      data.expenseId,
      data.amount,
      data.type,
      data.remarks,
    )
    return updatedExpense[0]
  },

  //Modify anexpense approval status
  async modifyExpenseApprovalStatus(expId: string, status: boolean) {
    const expense = expenseRepository.updateExpenseApprovalStatus(expId, status)
    return expense
  },

  //Upload expense photo
  async uploadExpensePhoto(expenseId: string, file: File) {
    //Name file
    const fileName = `${Date.now()}-${file.name}`

    // Upload to Supabase Storage
    const uploadResult = await uploadFile(
      file!,
      `${expenseId}/proof/${fileName}`,
    )
    //Update photoUrl in DB
    await expenseRepository.updateExpensePhotoUrl(expenseId, uploadResult.path)
    return uploadResult.path
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
