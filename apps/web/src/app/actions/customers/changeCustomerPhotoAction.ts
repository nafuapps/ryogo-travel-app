"use server"

import { writePermissions } from "@/lib/permissions"
import { generateCustomerPhotoPathName } from "@/lib/utils"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeCustomerPhotoAction({
  customerId,
  agencyId,
  photo,
}: {
  customerId: string
  agencyId: string
  photo: File
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const uploadedPhoto = await uploadFile(
    photo,
    generateCustomerPhotoPathName(customerId),
  )
  const changedCustomer = await customerServices.updateCustomerPhoto(
    customerId,
    uploadedPhoto.path,
  )
  if (!changedCustomer) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: changedCustomer.id,
    isFeed: true,
    textKey: "CustomerPhotoChanged",
    textObject: {
      customerName: changedCustomer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${changedCustomer.id}`,
  })

  return changedCustomer
}
