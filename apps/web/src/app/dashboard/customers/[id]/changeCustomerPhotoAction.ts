"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeCustomerPhotoAction(
  customerId: string,
  photo: FileList,
) {
  if (photo && photo[0]) {
    const file = photo[0]
    const fileName = `${Date.now()}-${file.name}`
    const uploadedPhoto = await uploadFile(
      file,
      `${customerId}/photo/${fileName}`,
    )
    const customer = await customerServices.updateCustomerPhoto(
      customerId,
      uploadedPhoto.path,
    )

    if (!customer) return false
    return true
  } else {
    return false
  }
}
