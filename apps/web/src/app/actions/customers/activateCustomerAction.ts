"use server"

import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateCustomerAction(id: string, agencyId: string) {
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
  const customer = await customerServices.activateCustomer(id)
  if (!customer) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: customer.id,
    isFeed: true,
    textKey: "CustomerActivated",
    textObject: {
      customerName: customer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${customer.id}`,
  })

  return customer
}
