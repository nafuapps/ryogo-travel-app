"use server"

import { writePermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function activateCustomerAction({
  customerId,
  agencyId,
}: {
  customerId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const activatedCustomer = await customerServices.activateCustomer(customerId)
  if (!activatedCustomer) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: activatedCustomer.id,
    isFeed: true,
    textKey: "CustomerActivated",
    textObject: {
      customerName: activatedCustomer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${activatedCustomer.id}`,
  })

  return activatedCustomer
}
