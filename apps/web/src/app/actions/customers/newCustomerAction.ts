"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateCustomerPhotoPathName } from "@/lib/utils"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { NewCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newCustomerAction({
  data,
}: {
  data: NewCustomerRequestType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.addedByUserId ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const customer = await customerServices.addNewCustomer(data)
  if (!customer) return

  //Upload customer photo if attached
  const [file] = data.photo || []
  if (file) {
    const uploadedPhoto = await uploadFile(
      file,
      generateCustomerPhotoPathName(customer.id, file),
    )
    await customerServices.updateCustomerPhoto(customer.id, uploadedPhoto.path)
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
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
