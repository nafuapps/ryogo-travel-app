"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { NewCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newCustomerAction(data: NewCustomerRequestType) {
  const customer = await customerServices.addNewCustomer(
    data.name,
    data.phone,
    data.city,
    data.state,
    data.agencyId,
    data.addedByUserId,
    data.email,
    data.address,
    data.remarks,
  )

  if (customer.id) {
    if (data.photo && data.photo[0]) {
      const photo = data.photo[0]
      const fileName = `${Date.now()}-${photo.name}`
      const uploadedPhoto = await uploadFile(
        photo,
        `${customer.id}/photo/${fileName}`,
      )
      await customerServices.updateCustomerPhoto(
        customer.id,
        uploadedPhoto.path,
      )
    }
  }
  return customer
}
