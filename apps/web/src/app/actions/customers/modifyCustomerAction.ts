"use server"

import { writePermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function modifyCustomerAction({
  data,
}: {
  data: ModifyCustomerRequestType
}) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const modifiedCustomer = await customerServices.modifyCustomer(data)
  if (!modifiedCustomer) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: modifiedCustomer.id,
    isFeed: true,
    textKey: "CustomerModified",
    textObject: {
      customerName: modifiedCustomer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${modifiedCustomer.id}`,
  })

  return modifiedCustomer
}
