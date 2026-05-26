"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateCustomerPhotoPathName } from "@/lib/utils"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { NewCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newCustomerAction(data: NewCustomerRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
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
  if (!customer) return

  if (data.photo && data.photo[0]) {
    const photo = data.photo[0]
    const uploadedPhoto = await uploadFile(
      photo,
      generateCustomerPhotoPathName(customer.id, photo),
    )
    await customerServices.updateCustomerPhoto(customer.id, uploadedPhoto.path)
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: customer.id,
    isFeed: true,
    textKey: "CustomerAdded",
    textObject: {
      customerName: customer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${customer.id}`,
  })

  return customer
}
