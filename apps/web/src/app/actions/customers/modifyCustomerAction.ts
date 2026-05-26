"use server"

import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function modifyCustomerAction(
  id: string,
  agencyId: string,
  data: {
    name?: string
    email?: string
    address?: string
    remarks?: string
    state: string
    city: string
  },
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
  const customer = await customerServices.modifyCustomer(
    id,
    data.state,
    data.city,
    data.name,
    data.email,
    data.address,
    data.remarks,
  )
  if (!customer) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.CUSTOMER,
    entityId: customer.id,
    isFeed: true,
    textKey: "CustomerModified",
    textObject: {
      customerName: customer.name,
      userName: currentUser.name,
    },
    link: `/dashboard/customers/${customer.id}`,
  })

  return customer
}
