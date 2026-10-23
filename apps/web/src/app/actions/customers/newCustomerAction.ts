"use server"

import { writePermissions } from "@/lib/permissions"
import { generateCustomerPhotoPathName } from "@/lib/utils"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { NewCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newCustomerAction({
  data,
}: {
  data: NewCustomerRequestType
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.addedByUserId,
  })
  if (!currentUser) return

  const addedCustomer = await customerServices.addNewCustomer(data)
  if (!addedCustomer) return

  //Upload customer photo if attached
  const file = data.photo
  if (file) {
    const uploadedPhoto = await uploadFile(
      file,
      generateCustomerPhotoPathName(addedCustomer.id),
    )
    await customerServices.updateCustomerPhoto(
      addedCustomer.id,
      uploadedPhoto.path,
    )
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: addedCustomer.id,
    isFeed: true,
    textKey: "CustomerAdded",
    textObject: {
      customerName: addedCustomer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${addedCustomer.id}`,
  })

  return addedCustomer
}
