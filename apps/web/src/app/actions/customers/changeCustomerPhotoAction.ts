"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateCustomerPhotoPathName } from "@/lib/utils"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeCustomerPhotoAction(
  customerId: string,
  photo: FileList,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!photo[0]) {
    return
  }

  const file = photo[0]
  const uploadedPhoto = await uploadFile(
    file,
    generateCustomerPhotoPathName(customerId, file),
  )
  const customer = await customerServices.updateCustomerPhoto(
    customerId,
    uploadedPhoto.path,
  )
  return customer
}
