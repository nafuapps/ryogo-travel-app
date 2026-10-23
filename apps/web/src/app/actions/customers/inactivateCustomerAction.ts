"use server"

import { writePermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateCustomerAction({
  customerId,
  agencyId,
}: {
  customerId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const inactivatedCustomer =
    await customerServices.inactivateCustomer(customerId)
  if (!inactivatedCustomer) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: inactivatedCustomer.id,
    isFeed: true,
    textKey: "CustomerInactivated",
    textObject: {
      customerName: inactivatedCustomer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${inactivatedCustomer.id}`,
  })

  return inactivatedCustomer
}
