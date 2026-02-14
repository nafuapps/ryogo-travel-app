"use server"

import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  return customer
}
